import { cva } from "class-variance-authority";
import {
  BookIcon,
  BotIcon,
  CaptionsIcon,
  ClockIcon,
  DatabaseZapIcon,
  ExternalLink,
  ExternalLinkIcon,
  FishIcon,
  GithubIcon,
  Heart,
  type LucideIcon,
  UploadCloudIcon,
} from "lucide-react";
import {
  CpuIcon,
  FileTextIcon,
  KeyboardIcon,
  LayoutIcon,
  LibraryIcon,
  RocketIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@meeting-baas/ui/button";
import Img from "@/app/(home)/hero.png";
import { AspectRatio } from "@meeting-baas/ui/aspect-ratio";
import Meteors from "@meeting-baas/ui/meteors";
import CalendarLanding from "./components/calendar";

export default function Page(): React.ReactElement {
  return (
    <>
      <main className="relative px-4 md:px-6 py-6 md:py-12">
        <div>
          <div className="relative">
            <Hero />
          </div>
          <Testimonials />
          <div className="relative overflow-hidden border-t border-x py-16 sm:py-24">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
              One App
              <br />
              Endless Possibilities
            </h2>
          </div>
          <KeyFeatures />
          <div className="relative overflow-hidden border-t border-x py-8 sm:py-16">
            <h2 className="text-center text-2xl font-semibold md:text-3xl lg:text-4xl">
              <div className="inline-flex items-center gap-2">
                More Features
                <RocketIcon className="fill-fd-primary/30 text-fd-primary size-8 transition-transform hover:scale-125" />
              </div>
            </h2>
          </div>
          <Features />
          <Contributing />
          <CTA />
        </div>
      </main>
    </>
  );
}

function Hero(): React.ReactElement {
  return (
    <div className="relative z-[2] flex flex-col overflow-hidden bg-fd-background px-4 py-8 md:px-6 md:py-10 border-x border-t">
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Meteors number={30} />
      </div>
      <h1 className="mb-4 md:mb-6 text-3xl font-medium md:hidden">
        Build Your Docs
      </h1>
      <h1 className="mb-4 md:mb-6 max-w-[600px] text-4xl font-medium max-md:hidden">
        Organize your meetings through one app
      </h1>
      <p className="mb-4 md:mb-6 text-fd-muted-foreground md:max-w-[80%] md:text-xl">
        Transcript Seeker is an{" "}
        <span className="text-fd-foreground">open-source</span> transcription
        playground powered by{" "}
        <span className="text-fd-foreground">advanced transcription APIs</span>{" "}
        and meeting bot technology. Upload, store, transcribe, and chat with
        your recordings—directly in your browser.
      </p>
      <div className="inline-flex items-center gap-3">
        <Link
          href="/getting-started"
          className={cn(
            buttonVariants({
              size: "lg",
              className: "rounded-full gap-2 group",
            })
          )}
        >
          Get Started
          <RocketIcon className="fill-fd-primary-foreground/30 text-fd-primary-foreground size-8 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
        </Link>
        <a
          href="https://app.transcriptseeker.com"
          className={cn(
            buttonVariants({
              size: "lg",
              variant: "outline",
              className: "rounded-full bg-fd-background gap-2 group",
            })
          )}
        >
          Open App
          <ExternalLink className="fill-fd-accent-foreground/30 text-fd-accent-foreground size-8 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
        </a>
      </div>
      {/* <Image
        src={Img}
        alt="preview"
        className="mb-[-250px] mt-8 min-w-[800px] select-none duration-1000 animate-in fade-in slide-in-from-bottom-12 md:mb-[-370px] md:min-w-[1100px]"
        priority
      /> */}
      <AspectRatio ratio={16 / 9}>
        <Image
          src={Img}
          objectFit="cover"
          alt="Transcript Seeker preview"
          fill
          className="h-full w-full rounded-xl object-cover select-none duration-1000 animate-in fade-in slide-in-from-bottom-12 w-full mt-6 border border-border"
          priority
        />
      </AspectRatio>
    </div>
  );
}

function Testimonials(): React.ReactElement {
  return (
    <div className="relative flex flex-col items-center overflow-hidden pb-4 px-4 md:px-6 border-x">
      <div className="rounded-xl border bg-fd-muted p-4 shadow-sm w-full">
        <p className="text-sm font-medium">
          {`"It's magnificent!! I absolutely want something like this for [company]. The presentation is so clean and well-executed."`}
        </p>
        <div className="mt-4 flex flex-row items-center gap-2">
          <Image
            src="https://avatars.githubusercontent.com/u/9919"
            alt="avatar"
            width="32"
            height="32"
            className="size-8 rounded-full"
          />
          <div>
            <a
              href="https://meetingbaas.com"
              rel="noreferrer noopener"
              className="text-sm font-medium"
            >
              Philippe Drion
            </a>
            <p className="text-xs text-fd-muted-foreground">
              Software Engineer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-r md:grid-cols-2">
      <Feature
        icon={CaptionsIcon}
        subheading="Transcription Support"
        heading="Upload and Store Recordings"
        description={
          <>
            <span className="font-medium text-foreground">
              Compatible with transcription APIs like Gladia and AssemblyAI.
            </span>{" "}
            <span>
              Transcript Seeker offers seamless storage and syncing for
              transcripts and recordings.
            </span>
          </>
        }
        className="overflow-hidden"
      />

      <Feature
        icon={SearchIcon}
        subheading="Search Transcripts"
        heading="Powerful Search for Transcripts"
        description="Easily search your transcripts, enhancing transcript discoverability."
      >
        <Link
          href="/docs/concepts/search"
          className={cn(
            buttonVariants({ variant: "outline", className: "mt-4 group" })
          )}
        >
          Learn More
          {/* todo: each btn will have this anim */}
          <BookIcon className="fill-fd-accent-foreground/30 text-fd-accent-foreground size-4 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
        </Link>
        <Search />
      </Feature>

      <Feature
        icon={CpuIcon}
        subheading="Real-Time Data Streaming"
        heading="Instant Transcript Synchronization"
        description="Sync transcript data instantly with MeetingBaas APIs, ensuring up-to-date content across devices."
      >
        <div className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 rounded-lg border bg-card p-4 text-xs leading-loose">
            <code>Connecting to MeetingBaas API...</code>
            <code className="text-muted-foreground">
              Real-time data streaming initiated
            </code>
            <code className="text-green-500">Data successfully synced</code>
          </div>
        </div>
      </Feature>

      <Feature
        icon={FishIcon}
        subheading="MeetingBaas Integration"
        heading="Integrated Calendar and Scheduling"
        description="Integrate MeetingBaas Calendars for seamless meeting management within Transcript Seeker."
      >
        <div className="mt-8 flex flex-col gap-4">
          <CalendarLanding />
        </div>
      </Feature>
    </div>
  );
}

function Feature({
  className,
  icon: Icon,
  heading,
  subheading,
  description,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  icon: LucideIcon;
  subheading: ReactNode;
  heading: ReactNode;
  description: ReactNode;
}): React.ReactElement {
  return (
    <div
      className={cn("border-l border-t px-6 py-12 md:py-16", className)}
      {...props}
    >
      <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
        <Icon className="size-4" />
        <p>{subheading}</p>
      </div>
      <h2 className="mb-2 text-lg font-semibold">{heading}</h2>
      <p className="text-fd-muted-foreground">{description}</p>

      {props.children}
    </div>
  );
}

function CTA(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-b border-r">
      <div className="relative flex flex-col items-center gap-4 md:gap-6 overflow-hidden border-l border-t px-8 py-14">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground">
          Try the hosted version of Transcript Seeker or install the open source
          project on your local machine.
        </p>
        <div className="flex flex-row flex-wrap gap-2">
          <Link
            href="/getting-started"
            className={cn(
              buttonVariants({
                className: " gap-2 group",
              })
            )}
          >
            Get Started
            <RocketIcon className="fill-fd-primary-foreground/30 text-fd-primary-foreground size-8 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
          </Link>
          <a
            href="https://github.com/transcript-seeker/transcript-seeker"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "group",
              })
            )}
          >
            View on GitHub
            <GithubIcon className="fill-fd-accent-foreground/30 text-fd-accent-foreground size-4 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
          </a>
        </div>
      </div>
      {/* <Integration className="border-t lg:col-span-2" /> */}
    </div>
  );
}

// const linkItemVariants = cva("transition-colors hover:bg-fd-muted");

const searchItemVariants = cva(
  "flex flex-col gap-2  gap-2 rounded-md px-4 py-3 text-sm text-fd-popover-foreground hover:bg-fd-accent transition-colors"
);

const searchTranscriptSnippets = [
  {
    id: 1,
    time: "00:03:24",
    speaker: "John",
    text: "So, moving on to our next agenda item, we need to discuss the project timeline.",
  },
  {
    id: 2,
    time: "00:05:12",
    speaker: "Sarah",
    text: "I have some concerns about the current deadline. I think we might need to adjust our expectations.",
  },
  {
    id: 3,
    time: "00:07:45",
    speaker: "Mike",
    text: "I agree with Sarah. The development team has encountered some unexpected challenges.",
  },
  {
    id: 4,
    time: "00:10:30",
    speaker: "Emily",
    text: "What specific challenges are we facing? Can we address them without pushing the deadline?",
  },
  {
    id: 5,
    time: "00:12:18",
    speaker: "John",
    text: "Good point, Emily. Mike, can you elaborate on the challenges your team is facing?",
  },
];

function Search(): React.ReactElement {
  return (
    <div className="mt-6 rounded-lg bg-gradient-to-b from-fd-border p-px">
      <div className="flex select-none flex-col rounded-[inherit] bg-gradient-to-b from-fd-popover">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-fd-muted-foreground">
          <SearchIcon className="size-4" />
          Search Transcripts...
        </div>
        <div className="border-t border-border p-2">
          <div className="h-[300px] overflow-auto">
            {searchTranscriptSnippets.map((snippet, i) => (
              <div
                key={snippet.id}
                className={cn(
                  searchItemVariants({
                    className: i === 0 ? "bg-fd-accent" : "",
                  })
                )}
              >
                <div className="flex items-center gap-3">
                  <FileTextIcon className="size-4 text-fd-muted-foreground" />
                  <div className="flex-1 flex flex-col">
                    <div className="font-medium">{snippet.speaker}</div>
                    <div className="text-xs text-fd-muted-foreground flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {snippet.time}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-fd-muted-foreground">
                  {snippet.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyFeatures(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 border-r md:grid-cols-2 lg:grid-cols-3">
      <Highlight icon={RocketIcon} heading="Easy Setup.">
        Designed for beginners and experts alike, Transcript Seeker offers a
        streamlined setup, letting you quickly start uploading, transcribing,
        and organizing your recordings.
      </Highlight>
      <Highlight icon={UploadCloudIcon} heading="Upload and Transcribe.">
        Easily upload video or audio recordings and generate transcripts
        seamlessly through powerful APIs like Gladia and AssemblyAI.{" "}
      </Highlight>
      <Highlight icon={CaptionsIcon} heading="Interactive Transcripts.">
        Enjoy live transcript seeking with synchronized scrolling. Click on any
        word in the transcript to jump directly to that timestamp in the
        recording.
      </Highlight>
      <Highlight icon={BotIcon} heading="Meeting Bot Integration.">
        Connect to popular meeting platforms like Zoom, Google Meet, and
        Microsoft Teams. Leverage Meeting Baas’ bots to join, record, and
        transcribe meetings.
      </Highlight>
      <Highlight icon={KeyboardIcon} heading="Add Notes.">
        Keep track of key points by adding custom notes to your recordings or
        let AI generate summaries, so you don’t miss any critical details.
      </Highlight>
      <Highlight icon={DatabaseZapIcon} heading="Local Data Storage.">
        Store most data locally using PGLite to prioritize your privacy and
        control over sensitive information.
      </Highlight>
    </div>
  );
}

function Highlight({
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

function Contributing(): React.ReactElement {
  return (
    <div className="flex flex-col items-center border-x border-t px-4 py-16 text-center">
      <div className="flex gap-2 items-center">
        <h2 className="mb-4 text-xl font-semibold sm:text-2xl">MeetingBaas</h2>
        <Heart className="mb-4 text-fd-primary fill-fd-primary/30 size-7 transition-transform hover:scale-125" />
        <h2 className="mb-4 text-xl font-semibold sm:text-2xl">open-source</h2>
      </div>
      <p className="mb-4 text-fd-muted-foreground">
        Transcript Seeker is powered by the open-source community.
      </p>
      <div className="flex flex-row items-center gap-2">
        <a
          href="https://github.com/meeting-baas/transcript-seeker"
          rel="noreferrer noopener"
          className={cn(
            buttonVariants({ variant: "default", className: "group" })
          )}
        >
          Contribute
          <ExternalLinkIcon className="transition-transform group-hover:-rotate-12 group-hover:scale-125" />
        </a>
      </div>
    </div>
  );
}
