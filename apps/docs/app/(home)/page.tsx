import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@meeting-baas/ui/button";
import { cn } from "@meeting-baas/ui";
import Img from "./hero.png";

export default function HomePage() {
  return (
    <main className="p-4 flex flex-col flex-1 relative px-2 py-4 lg:py-10">
      <section className="relative rounded-xl flex flex-col flex-1">
        <div className="flex-1 gap-6 relative z-[2] flex flex-col overflow-hidden rounded-xl bg-fd-background max-md:text-center px-4 pt-4 md:pt-0">
          <h1 className=" text-4xl font-medium md:hidden">Transcript Seeker</h1>
          <h1 className=" max-w-[600px] text-4xl font-medium max-md:hidden">
            Transcript Seeker
          </h1>
          <p className="text-fd-muted-foreground md:max-w-[80%] md:text-xl">
            Transcript Seeker is an{" "}
            <span className="text-fd-foreground">open-source</span>{" "}
            transcription playground powered by{" "}
            <span className="text-fd-foreground">
              advanced transcription APIs
            </span>{" "}
            and meeting bot technology. Upload, store, transcribe, and chat with
            your recordings—directly in your browser.
          </p>
          <div className="inline-flex items-center gap-3 max-md:mx-auto">
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ size: "lg", className: "rounded-full" }),
              )}
            >
              Get Started
            </Link>
            <a
              href="https://github.com/Meeting-Baas/transcript-seeker"
              className={cn(
                buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "rounded-full bg-fd-background",
                }),
              )}
            >
              Learn More
            </a>
          </div>
          <Image
            src={Img}
            objectFit="cover"
            alt="Transcript Seeker preview"
            className="rounded-xl mt-4 min-w-[800px] select-none duration-1000 animate-in fade-in slide-in-from-bottom-12 w-full"
            priority
          />
        </div>
      </section>
    </main>
  );
}
