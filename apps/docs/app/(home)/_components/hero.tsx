import Img from "@/app/(home)/hero.png";
import { cn } from "@/lib/cn";
import { AspectRatio } from "@meeting-baas/ui/aspect-ratio";
import { buttonVariants } from "@meeting-baas/ui/button";
import Meteors from "@meeting-baas/ui/meteors";
import { ExternalLink, RocketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero(): React.ReactElement {
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
