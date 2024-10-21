import * as React from 'react';
import { Header } from '@/components/header';
import Chat from '@/components/viewer/chat';
import { formSchema as chatSchema } from '@/components/viewer/chat/chat-input';
import Editor from '@/components/viewer/editor';
import Transcript from '@/components/viewer/transcript';
import { Player as VideoPlayer } from '@/components/viewer/video-player';
import { useMediaQuery } from '@/hooks/use-media-query';
import { BLANK_EDITOR_DATA, LOADING_EDITOR_DATA, VITE_PROXY_URL } from '@/lib/constants';
import { getAPIKey, getEditorByMeetingId, setEditor as setEditorDB } from '@/queries';
import {
  // useChatsStore,
  useServerAvailabilityStore,
} from '@/store';
import { Editor as EditorT, Meeting, Message } from '@/types';
import { Separator } from '@radix-ui/react-separator';
import { MediaPlayerInstance } from '@vidstack/react';
import axios from 'axios';
import { Link } from 'lucide-react';
import { JSONContent } from 'novel';
import OpenAI from 'openai';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import type { SelectAPIKey, SelectEditor } from '@meeting-baas/db/schema';
import { cn } from '@meeting-baas/ui';
import { buttonVariants } from '@meeting-baas/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@meeting-baas/ui/resizable';

type ViewerProps = {
  botId: string;
  isLoading: boolean;
  meeting: Meeting;
};

const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  return apiKey?.content;
};


const fetchEditorByMeetingId = async (meetingId: SelectEditor['meetingId']) => {
  const editor = await getEditorByMeetingId({ meetingId });
  if (editor) return editor?.content;
  return null;
};

export function Viewer({ botId, isLoading, meeting }: ViewerProps) {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);

  const [data] = React.useState<Meeting>(meeting);
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

  const [video, setVideo] = React.useState<string | Blob>();

  // todo: add tests
  const { data: baasApiKey } = useSWR('baasApiKey', () => fetchAPIKey('meetingbaas'));
  const { data: openAIApiKey } = useSWR('openAIApiKey', () => fetchAPIKey('openai'));

  const { data: editorContent, mutate: mutateEditorContent, isLoading: isEditorContentLoading } = useSWR(`editorContent_${meeting.id}`, () => fetchEditorByMeetingId(meeting.id));

  // const chats = useChatsStore((state) => state.chats);
  // const setChats = useChatsStore((state) => state.setChats);

  const [messages, setMessages] = React.useState<Message[]>([]);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleEditorChange = async (content: JSONContent) => {
    if (!botId) return;
    console.log(editorContent)
    await setEditorDB({ meetingId: meeting.id, content: content });
    mutateEditorContent();
  };

  const handleMessageChange = (messages: Message[]) => {
    if (!botId) return;

    // const newChats = updateById({
    //   id: botId,
    //   originalData: chats,
    //   updateData: { messages }, // Assuming `content` should be part of the updated data
    // });
    // setChats(newChats);
  };

  // todo: decide if we want to create seperate tables for chat and editors or put them in the message table
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

      if (false) {
        res = await axios.post(VITE_PROXY_URL.concat('/chat'), {
          messages: messagesList,
        });
      } else {
        // todo: create a proxy openai server instead idk
        // todo: allow options for the proxy server to include api keys so no need for clients
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

  React.useEffect(() => {
    if (data?.type === "meetingbaas") {
      if (!data.assets.video_url) return;
      setVideo(data.assets.video_url);
    }
    if (data?.type === "local") {
      if (!data.assets.video_blob) return;
      setVideo(data.assets.video_blob);
    }
  }, [data]);

  React.useEffect(() => {
    if (data?.transcripts) {
      const transcripts: Meeting['transcripts'] = [];
      console.log(data?.transcripts)
      console.log('parsed transcript:', transcripts);
      setTranscripts(transcripts);
    }
  }, [data]);

  React.useEffect(() => {
    if (editorContent) {
      editor?.commands.setContent(editorContent);
    } else {
      editor?.commands.setContent(BLANK_EDITOR_DATA);
    }
  }, [isEditorContentLoading]);

  React.useEffect(() => {
    if (messages.length > 0) {
      handleMessageChange(messages);
      // } else if (messages.length === 0 && chats.length > 0) {
      //   const chat = getById({
      //     id: botId,
      //     data: chats,
      //   });

      //   if (!chat) return;
      //   if (!chat.messages) return;
      //   setMessages(chat.messages);
      // }
    }
  }, [messages, data]);

  return (
    <div className="min-h-svh">
      <div className="w-full">
        <div className="relative flex items-center justify-center h-16">
          <div className="absolute left-4">
            <Header
              path={[
                {
                  name: 'Recordings',
                },
              ]}
              border={false}
            />
          </div>
          <div className="flex-grow text-center">
            <h1 className="text-xl font-semibold">{meeting.name}</h1>
          </div>
          <div className="absolute right-4">
            <Link
              to={`/share/${botId}`}
              className={cn(buttonVariants({ variant: 'outline' }), 'ml-2 text-xl font-semibold')}
            >
              Share!!!
            </Link>
          </div>
        </div>
        <Separator />
      </div>
      <ResizablePanelGroup
        // padding + footer + header + 1px = 110px
        // header = 45px
        // footer = 48px
        // padding = pt-2 = 8px
        className="flex min-h-[200dvh] lg:min-h-[calc(100svh-theme(spacing.16))]"
        direction={isDesktop ? 'horizontal' : 'vertical'}
      >
        <ResizablePanel defaultSize={33} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="flex h-full flex-1 overflow-hidden rounded-b-none border-0 border-x border-b border-t lg:border-0 lg:border-b lg:border-l lg:border-t">
                {video && (
                  <VideoPlayer
                    // @ts-ignore
                    src={{
                      src: video,
                      type: data?.type === 'meetingbaas' ? 'video/mp4' : 'video/object',
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    setPlayer={setPlayerRef}
                    assetTitle={meeting.name}
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
        <ResizablePanel defaultSize={67} minSize={25}>
          <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
            <ResizablePanel defaultSize={67} minSize={25}>
              <Editor
                initialValue={LOADING_EDITOR_DATA}
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
