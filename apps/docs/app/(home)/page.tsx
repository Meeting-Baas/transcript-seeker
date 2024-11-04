import {
  RocketIcon,
} from "lucide-react";

import { Hero } from "@/app/(home)/_components/hero";
import { Testimonials } from "@/app/(home)/_components/testimonials";
import { CTA } from "@/app/(home)/_components/call-to-action";
import { Features } from "@/app/(home)/_components/features";
import { KeyFeatures } from "@/app/(home)/_components/key-features";
import { Contributing } from "@/app/(home)/_components/contributing";

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
