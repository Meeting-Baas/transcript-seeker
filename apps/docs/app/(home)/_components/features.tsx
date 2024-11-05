import { BookIcon, CaptionsIcon, FishIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CpuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@meeting-baas/ui/button";

import MockupCalendar from "./mockup-calendar";
import MockupSearch from "./mockup-search";

export function Features(): React.ReactElement {
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
            buttonVariants({ variant: "outline", className: "mt-4 group" }),
          )}
        >
          Learn More
          <BookIcon className="fill-fd-accent-foreground/30 text-fd-accent-foreground size-4 transition-all opacity-0 -ml-6 group-hover:ml-0 group-hover:opacity-100 group-hover:scale-125" />
        </Link>
        <MockupSearch />
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
          <MockupCalendar />
        </div>
      </Feature>
    </div>
  );
}

export function Feature({
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
