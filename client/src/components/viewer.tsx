import Transcript from '@/components/transcript';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Player as VideoPlayer } from '@/components/video-player';
import { useMediaQuery } from '@/hooks/use-media-query';
import { BLANK_MEETING_INFO, cn, MeetingInfo } from '@/lib/utils';
import { MediaPlayerInstance } from '@vidstack/react';
import axios from 'axios';
import * as React from 'react';

import Chat, { Message } from '@/components/chat';
import { formSchema as chatSchema } from '@/components/chat/chat-input';
import Editor from '@/components/editor';
import { openAIApiKeyAtom, serverAvailabilityAtom } from '@/store';

import { z } from 'zod';

import { HeaderTitle } from '@/components/header-title';

import { baasApiKeyAtom } from '@/store';
import { useAtom } from 'jotai';

import OpenAI from 'openai';
import { toast } from 'sonner';

type ViewerProps = {
  isLoading: boolean;
  meetingData: MeetingInfo;
};

export function Viewer({ isLoading, meetingData }: ViewerProps) {
  const [serverAvailability] = useAtom(serverAvailabilityAtom);

  React.useEffect(() => {
    if (!baasApiKey) return;
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

  const [player, setPlayer] = React.useState<MediaPlayerInstance>();
  const [currentTime, setCurrentTime] = React.useState(0);

  const [messages, setMessages] = React.useState<Message[]>([]);

  const [meetingURL, setMeetingURL] = React.useState<string | Blob>();

  const [baasApiKey] = useAtom(baasApiKeyAtom);
  const [openAIApiKey] = useAtom(openAIApiKeyAtom);

  // const [serverAvailability] = useAtom(serverAvailabilityAtom);

  const isDesktop = useMediaQuery('(min-width: 768px)');

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
    if (!baasApiKey) return;
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

  return (
    <>
      <div className="px-4 py-2">
        <HeaderTitle path="/meetings" title={meetingData.name} />
      </div>
      <ResizablePanelGroup
        className="flex min-h-[200dvh] lg:min-h-[85dvh]"
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
                initialValue={undefined}
                onChange={(v) => {
                  console.log('editor changed', v);
                }}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={33} minSize={25}>
              <Chat messages={messages} handleSubmit={handleChatSubmit} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
