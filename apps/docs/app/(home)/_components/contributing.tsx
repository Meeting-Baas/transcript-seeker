import {
  ExternalLinkIcon,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@meeting-baas/ui/button";

export function Contributing(): React.ReactElement {
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
  