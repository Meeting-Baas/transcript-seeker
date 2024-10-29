import { ModeToggle } from '@/components/mode-toggle';
import Chat from '@/components/viewer/chat';
import type { formSchema as chatSchema } from '@/components/viewer/chat/chat-input';
import Editor from '@/components/viewer/editor';
import Transcript from '@/components/viewer/transcript';
import { Player as VideoPlayer } from '@/components/viewer/video-player';
import { useApiKey } from '@/hooks/use-api-key';
import { useChat } from '@/hooks/use-chat';
import { useEditor } from '@/hooks/use-editor';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  BLANK_EDITOR_DATA,
  LOADING_EDITOR_DATA,
  VITE_PROXY_URL,
  VITE_S3_PREFIX,
} from '@/lib/constants';
import { leaveMeeting as leaveMeetingQuery } from '@/lib/meetingbaas';
import { createMessage, renameMeeting as renameMeetingDb, setEditor as setEditorDB } from '@/queries';
import type { Meeting, Message } from '@/types';
import type { MediaPlayerInstance } from '@vidstack/react';
import { DownloadIcon, PencilIcon } from 'lucide-react';
import type { JSONContent } from 'novel';
import OpenAI from 'openai';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import type { z } from 'zod';

import { cn } from '@meeting-baas/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meeting-baas/ui/breadcrumb';
import { Button } from '@meeting-baas/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@meeting-baas/ui/resizable';
import { Switch } from '@meeting-baas/ui/switch';
import RenameModal from '../meeting/rename-modal';

interface ViewerProps {
  botId: string;
  isLoading: boolean;
  meeting: Meeting;
}

export function Viewer({ botId, isLoading, meeting: data }: ViewerProps) {
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
  const [showRename, setShowRename] = React.useState(false);
  const [player, setPlayer] = React.useState<MediaPlayerInstance>();
  const [currentTime, setCurrentTime] = React.useState(0);

  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });
  const { apiKey: openAIApiKey } = useApiKey({ type: 'openai' });

  const { editor: editorDB, isLoading: isEditorLoading } = useEditor({ meetingId: data.id });

  const {
    messages: chatMessages,
    isLoading: isChatLoading,
  } = useChat({ meetingId: data.id });

  const { trigger: leaveMeeting, isMutating: isLeavingMeeting } = useSWRMutation(
    ['leaveMeeting', botId, baasApiKey],
    ([key, botId, baasApiKey]) => leaveMeetingQuery({ botId, apiKey: baasApiKey! }),
  );

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const video = useMemo(() => {
    if (data.type === 'meetingbaas' && data.assets.video_url) {
      const url = data.assets.video_url.replace(VITE_S3_PREFIX, '');
      return `${VITE_PROXY_URL}/api/s3${url}`;
    }
    if (data.type === 'local' && data.assets.video_blob) {
      return data.assets.video_blob;
    }
    return null;
  }, [data]);

  const handleEditorChange = useCallback(
    async (content: JSONContent) => {
      if (!data) return;
      await setEditorDB({ meetingId: data.id, content: content });
      mutate(['editor', data.id]);
    },
    [data],
  );

  const [localMeetingName, setLocalMeetingName] = React.useState(data.name);

  const handleRename = async (newName: string) => {
    try {
      await renameMeetingDb({ id: data.id, name: newName });
      mutate(['meeting', data.id]);
      setLocalMeetingName(newName); // Update local state
      toast.success('Successfully renamed meeting.');
      setShowRename(false);
    } catch (error) {
      console.error('Error renaming meeting:', error);
      toast.error('Failed to rename meeting.');
    }
  };

  const handleChatSubmit = useCallback(
    async (values: z.infer<typeof chatSchema>) => {
      const message = values.message;
      createMessage({ meetingId: data.id, message: { content: message, role: 'user' } });
      mutate(['chat', data.id]);

      try {
        if (!openAIApiKey) return;

        const messagesList: Message[] = [
          ...transcripts.map((transcript) => ({
            content: transcript.words.map((word: { text: string }) => word.text).join(' '),
            role: 'user' as const,
          })),
          ...chatMessages,
        ];

        const openai = new OpenAI({
          apiKey: openAIApiKey,
          dangerouslyAllowBrowser: true,
        });

        const systemPrompt =
          'You are a helpful assistant named AI Meeting Bot. You will be given a context of a meeting and some meeting notes, you will answer questions based on the context.';
        const result = await openai.chat.completions.create({
          messages: [{ role: 'system', content: systemPrompt }, ...messagesList],
          model: 'gpt-4o-mini',
        });

        await createMessage({
          meetingId: data.id,
          message: {
            role: 'assistant',
            content: result.choices[0]?.message.content || '',
          },
        });
      } catch (error) {
        console.error('error', error);
        toast.error('Oops! Something went wrong.');
        await createMessage({
          meetingId: data.id,
          message: { content: `Oops! Something went wrong. ${error}`, role: 'assistant' },
        });
      }
      mutate(['chat', data.id]);

    },
    [chatMessages, transcripts, openAIApiKey],
  );

  const handleQuit = useCallback(() => {
    if (!baasApiKey) return;
    leaveMeeting();
  }, [baasApiKey, leaveMeeting]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      if (player) {
        player.currentTime = time;
      }
    },
    [player],
  );

  const setPlayerRef = useCallback((player: MediaPlayerInstance) => {
    setPlayer(player);
  }, []);

  // Update transcripts when data changes
  React.useEffect(() => {
    if (data.transcripts) {
      setTranscripts(data.transcripts);
    }
  }, [data.transcripts]);

  // Update editor content when editorDB changes
  React.useEffect(() => {
    if (editorDB?.content) {
      editor?.commands.setContent(editorDB.content);
    } else {
      editor?.commands.setContent(BLANK_EDITOR_DATA);
    }
  }, [isEditorLoading]);

  const [showEditorChat, setShowEditorChat] = React.useState(false);

  return (
    <div className="min-h-svh">
      <div className="w-full">
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 bg-background px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recording</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* <div className="flex-grow text-center">
            <h1 className="text-xl font-semibold">{data.name}</h1>
          </div> */}
          <div className="flex-grow text-center flex items-center justify-center">
            <h1 className="text-xl font-semibold">{localMeetingName}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setShowRename(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>

          <label htmlFor="show-editor-chat" className="text-sm font-medium">
            Show Editor & Chat
          </label>
          <Switch
            id="show-editor-chat"
            checked={showEditorChat}
            onCheckedChange={setShowEditorChat}
          />
          {/* {data.type === 'meetingbaas' && !!data.endedAt && ( */}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleQuit}
              disabled={!!data.endedAt || isLeavingMeeting}
            >
              Quit
            </Button>
            <ModeToggle />
          </div>
          {/* )} */}

        </header>
      </div>
      <div className={cn("flex justify-center", showEditorChat ? "w-full" : "max-w-3xl mx-auto")}>
        <ResizablePanelGroup
          className="flex min-h-[200dvh] lg:min-h-[calc(100svh-theme(spacing.16))]"
          direction={isDesktop ? 'horizontal' : 'vertical'}
        >
          <ResizablePanel defaultSize={showEditorChat ? 50 : 100} minSize={25}>
            <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
              <ResizablePanel defaultSize={50} minSize={25}>
                {video && (
                  <VideoPlayer
                    // @ts-ignore
                    src={{
                      src: data.type === 'meetingbaas' ? (video as string) : (video as Blob),
                      type: data.type === 'meetingbaas' ? 'video/mp4' : 'video/object',
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    setPlayer={setPlayerRef}
                    assetTitle={data.name}
                  />
                )}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={15}>
                <div className="h-full max-h-full flex-1 space-y-2 overflow-auto rounded-t-none border-0 border-x bg-background p-4 md:p-6 lg:border-0 lg:border-b lg:border-l">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="px-0.5 text-2xl font-bold md:text-3xl">Transcript</h2>
                    <div className="flex gap-2">
                      <Button className="h-8" size="sm">
                        <DownloadIcon className="h-4 w-4" /> Download JSON
                      </Button>
                      <Button className="h-8" size="sm">
                        <DownloadIcon className="h-4 w-4" /> Download Video
                      </Button>
                    </div>
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
          {showEditorChat && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={25}>
                <ResizablePanelGroup direction="vertical" className={cn('flex h-full w-full')}>
                  <ResizablePanel defaultSize={50} minSize={25}>
                    <Editor
                      initialValue={LOADING_EDITOR_DATA}
                      onCreate={({ editor }) => setEditor(editor)}
                      onChange={handleEditorChange}
                    />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={33} minSize={25}>
                    <Chat
                      messages={chatMessages}
                      handleSubmit={handleChatSubmit}
                      disabled={{
                        value: !openAIApiKey || isChatLoading,
                        reason: isChatLoading ? 'loading' : 'openai',
                      }}
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      <RenameModal
        open={showRename}
        onOpenChange={setShowRename}
        defaultValues={{
          name: localMeetingName,
        }}
        onSubmit={(values) => handleRename(values.name)}
      />
    </div>
  );
}
