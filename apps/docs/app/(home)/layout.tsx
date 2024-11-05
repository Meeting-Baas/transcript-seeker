import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="mt-auto border-t bg-fd-card p-4 text-fd-secondary-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">Transcript Seeker</p>
          <p className="text-xs">
            Built by{" "}
            <a
              href="https://meetingbaas.com/"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium"
            >
              Meeting Baas
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
