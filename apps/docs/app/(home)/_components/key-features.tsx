import {
  BotIcon,
  CaptionsIcon,
  DatabaseZapIcon,
  UploadCloudIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { KeyboardIcon, RocketIcon } from "lucide-react";
import type { ReactNode } from "react";

export function KeyFeatures(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-r md:grid-cols-2 lg:grid-cols-3">
      <KeyFeature icon={RocketIcon} heading="Easy Setup.">
        Designed for beginners and experts alike, Transcript Seeker offers a
        streamlined setup, letting you quickly start uploading, transcribing,
        and organizing your recordings.
      </KeyFeature>
      <KeyFeature icon={UploadCloudIcon} heading="Upload and Transcribe.">
        Easily upload video or audio recordings and generate transcripts
        seamlessly through powerful APIs like Gladia and AssemblyAI.{" "}
      </KeyFeature>
      <KeyFeature icon={CaptionsIcon} heading="Interactive Transcripts.">
        Enjoy live transcript seeking with synchronized scrolling. Click on any
        word in the transcript to jump directly to that timestamp in the
        recording.
      </KeyFeature>
      <KeyFeature icon={BotIcon} heading="Meeting Bot Integration.">
        Connect to popular meeting platforms like Zoom, Google Meet, and
        Microsoft Teams. Leverage Meeting Baas’ bots to join, record, and
        transcribe meetings.
      </KeyFeature>
      <KeyFeature icon={KeyboardIcon} heading="Add Notes.">
        Keep track of key points by adding custom notes to your recordings or
        let AI generate summaries, so you don’t miss any critical details.
      </KeyFeature>
      <KeyFeature icon={DatabaseZapIcon} heading="Local Data Storage.">
        Store most data locally using PGLite to prioritize your privacy and
        control over sensitive information.
      </KeyFeature>
    </div>
  );
}

export function KeyFeature({
  icon: Icon,
  heading,
  children,
}: {
  icon: LucideIcon;
  heading: ReactNode;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="border-l border-t px-6 py-12 hover:bg-fd-muted transition-colors">
      <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
        <Icon className="size-4" />
        <h2 className="text-sm font-medium">{heading}</h2>
      </div>
      <span className="font-medium">{children}</span>
    </div>
  );
}
