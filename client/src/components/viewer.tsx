import Transcript from '@/components/viewer/transcript';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Player as VideoPlayer } from '@/components/viewer/video-player';
import { useMediaQuery } from '@/hooks/use-media-query';
import { BLANK_MEETING_INFO, cn } from '@/lib/utils';
import { Editor as EditorT, MeetingInfo, Message } from '@/types';
import { MediaPlayerInstance } from '@vidstack/react';
import axios from 'axios';
import * as React from 'react';

import Chat from '@/components/viewer/chat';
import { formSchema as chatSchema } from '@/components/viewer/chat/chat-input';
import Editor from '@/components/viewer/editor';
import {
  useApiKeysStore,
  useChatsStore,
  useEditorsStore,
  useServerAvailabilityStore,
} from '@/store';

import { z } from 'zod';

import { HeaderTitle } from '@/components/header-title';

import OpenAI from 'openai';
import { toast } from 'sonner';
import { JSONContent } from 'novel';
import { getById, updateById } from '@/lib/db';
import { Separator } from '@radix-ui/react-separator';

type ViewerProps = {
  botId: string;
  isLoading: boolean;
  meetingData: MeetingInfo;
};

export function Viewer({ botId, isLoading, meetingData }: ViewerProps) {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  React.useEffect(() => {
    // if (!baasApiKey) return;
    setData(meetingData);
  }, [meetingData]);

  const [data, setData] = React.useState<MeetingInfo>(BLANK_MEETING_INFO);
  const [transcripts, setTranscripts] = React.useState<any[]>([
    {
      speaker: '',
      words: [
        {
          start_time: 0,
          end_time: 0,
          text: '',
        },
      ],
    },
  ]);

  const [editor, setEditor] = React.useState<JSONContent | undefined>(undefined);

  const [player, setPlayer] = React.useState<MediaPlayerInstance>();
  const [currentTime, setCurrentTime] = React.useState(0);

  const [meetingURL, setMeetingURL] = React.useState<string | Blob>();

  const baasApiKey = useApiKeysStore((state) => state.baasApiKey);
  const openAIApiKey = useApiKeysStore((state) => state.openAIApiKey);

  const editors = useEditorsStore((state) => state.editors);
  const setEditors = useEditorsStore((state) => state.setEditors);

  const chats = useChatsStore((state) => state.chats);
  const setChats = useChatsStore((state) => state.setChats);

  const [messages, setMessages] = React.useState<Message[]>([]);

  //   const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleEditorChange = (content: JSONContent) => {
    if (!botId) return;

    const newEditors = updateById({
      id: data.id,
      originalData: editors,
      updateData: { content }, // Assuming `content` should be part of the updated data
    });
    setEditors(newEditors);
  };

  const handleMessageChange = (messages: Message[]) => {
    if (!botId) return;

    const newChats = updateById({
      id: data.id,
      originalData: chats,
      updateData: { messages }, // Assuming `content` should be part of the updated data
    });
    setChats(newChats);
  };

  const handleChatSubmit = async (values: z.infer<typeof chatSchema>) => {
    const message = values.message;
    setMessages((prev) => [...prev, { content: message, role: 'user' }]);
    // setIsLoading(true);

    // axios handling
    try {
      let messagesList: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      transcripts.forEach((transcript) => {
        let text: string = '';
        transcript.words.forEach((word: { text: string }) => {
          text += word.text + ' ';
        });
        messagesList.push({ content: text, role: 'user' });
      });

      messagesList.push(...messages);
      messagesList.push({ content: message, role: 'user' });

      let res: {
        data: {
          response: string;
        };
      };
      if (serverAvailability === 'server') {
        res = await axios.post('/api/chat', {
          messages: messagesList,
        });
      } else {
        if (!openAIApiKey) {
          toast.error('No OpenAI API Key found!');
          res = {
            data: {
              response: 'No OpenAI API Key found!',
            },
          };
          setMessages((prev) => [...prev, { content: res.data.response, role: 'assistant' }]);
          return;
        }

        const openai = new OpenAI({
          apiKey: openAIApiKey,
          dangerouslyAllowBrowser: true,
          // https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
        });

        const systemPrompt =
          'You are a helpful assistant named AI Meeting Bot. You will be given a context of a meeting and some meeting notes, you will answer questions based on the context.';
        const result = await openai.chat.completions.create({
          messages: [{ role: 'system', content: systemPrompt }, ...messagesList],
          model: 'gpt-4o-mini',
        });

        res = {
          data: {
            response: result.choices[0]!.message?.content || '',
          },
        };
      }

      setMessages((prev) => [...prev, { content: res.data.response, role: 'assistant' }]);
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleTimeUpdate = React.useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleSeek = React.useCallback(
    (time: number) => {
      if (player) {
        // seek on click
        player.currentTime = time;
      }
    },
    [player],
  );

  const setPlayerRef = React.useCallback((player: MediaPlayerInstance) => {
    setPlayer(player);
  }, []);

  // this should come along the loaded data or props and doesn't make sense.
  React.useEffect(() => {
    // if (!baasApiKey) return;
    if (data?.assets?.length > 0) {
      let url = data?.assets[0]?.mp4_s3_path;
      if (!url) return;

      if (typeof url === 'string') {
        url = url.split('/bots-videos/')[1];
        setMeetingURL('/s3/' + url);
      } else {
        setMeetingURL(url);
      }
    }
  }, [baasApiKey, data]);

  React.useEffect(() => {
    if (data?.editors?.length > 0) {
      const editors = data.editors;
      const transcripts: MeetingInfo['editors'][0]['video']['transcripts'][0][] = [];
      editors.forEach((editor) => {
        transcripts.push(...editor.video.transcripts);
      });

      console.log('parsed transcript:', transcripts);
      setTranscripts(transcripts);
    }
  }, [data]);

  React.useEffect(() => {
    if (editors.length > 0) {
      const editorData: EditorT | undefined = getById({
        data: editors,
        id: botId,
      });
      if (!editorData) {
        editor?.commands.setContent(undefined);
        return;
      }
      editor?.commands.setContent(editorData.content);
    }
  }, [editors, data]);

  React.useEffect(() => {
    if (messages.length > 0) {
      handleMessageChange(messages);
    } else if (messages.length === 0 && chats.length > 0) {
      const chat = getById({
        id: botId,
        data: chats,
      });

      if (!chat) return;
      if (!chat.messages) return;
      setMessages(chat.messages);
    }
  }, [messages, data]);

  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <div>
        <div className="px-4 py-1">
          <HeaderTitle path="/meetings" title={meetingData.name} border={false} />
        </div>
        <Separator />
      </div>
      <ResizablePanelGroup
        // padding + footer + header + 1px = 110px
        // header = 45px
        // footer = 48px
        // padding = pt-2 = 8px
        className="flex min-h-[200dvh] lg:min-h-[calc(100dvh-102px)]"
        direction={isDesktop ? 'horizontal' : 'vertical'}
      >
        <ResizablePanel defaultSize={67} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="flex h-full flex-1 overflow-hidden rounded-b-none border-0 border-x border-b border-t lg:border-0 lg:border-b lg:border-l lg:border-t">
                {meetingURL && (
                  <VideoPlayer
                    // @ts-ignore
                    src={{
                      src: meetingURL,
                      type: typeof meetingURL == 'string' ? 'video/mp4' : 'video/object',
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    setPlayer={setPlayerRef}
                    assetTitle={meetingData.name}
                  />
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={15}>
              <div className="h-full max-h-full flex-1 space-y-2 overflow-auto rounded-t-none border-0 border-x bg-background p-4 md:p-6 lg:border-0 lg:border-b lg:border-l">
                <div>
                  <h2 className="px-0.5 text-2xl font-bold md:text-3xl">Meeting Transcript</h2>
                  {/* <p className="text-muted-foreground">
                    A detailed transcript of the video meeting.
                  </p> */}
                </div>
                {isLoading && <div className="flex px-0.5">Loading...</div>}
                <Transcript
                  transcript={transcripts}
                  currentTime={currentTime}
                  onWordClick={handleSeek}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={67} minSize={25}>
              <Editor
                initialValue={{
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Loading...',
                        },
                      ],
                    },
                  ],
                }}
                onCreate={({ editor }) => setEditor(editor)}
                onChange={handleEditorChange}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={33} minSize={25}>
              <Chat messages={messages} handleSubmit={handleChatSubmit} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
