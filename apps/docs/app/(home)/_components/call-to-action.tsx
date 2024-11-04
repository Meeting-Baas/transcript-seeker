import { GithubIcon } from "lucide-react";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@meeting-baas/ui/button";

export function CTA(): React.ReactElement {
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
