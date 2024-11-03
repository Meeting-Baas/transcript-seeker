import { Building2, CloudIcon, LibraryIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@meeting-baas/ui/button';
import { cn } from '@/lib/cn';

export default function DocsPage(): React.ReactElement {
  return (
    // todo: don't use px use tailwidn spacing
    <main className="container flex flex-col justify-center items-center text-center h-[calc(100svh_-_54px_-_73px)]">
      <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
        Getting Started
      </h1>
      <p className="text-fd-muted-foreground">
        You can use the hosted version of Transcript Seeker, or self-host transcript seeker.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <Item href="https://app.transcriptseeker.com">
          <Icon>
            <CloudIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Access the Hosted Version</h2>
          <p className="text-sm text-fd-muted-foreground">
            Try Transcript Seeker online—no setup required.
          </p>
        </Item>
        <Item href="/docs">
          <Icon>
            <LibraryIcon className="size-full" />
          </Icon>
          <h2 className="mb-2 text-lg font-semibold">Self-Host Transcript Seeker</h2>
          <p className="text-sm text-fd-muted-foreground">
            Full documentation for self-hosting with a powerful, user-friendly interface.
          </p>
        </Item>
      </div>
    </main>
  );
}

function Icon({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div
      className="mb-2 size-9 rounded-lg border p-1.5 shadow-fd-primary/30"
      style={{
        boxShadow: 'inset 0px 8px 8px 0px var(--tw-shadow-color)',
      }}
    >
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { children: React.ReactNode },
): React.ReactElement {
  return (
    <Link
      {...props}
      className="rounded-2xl border border-border p-6 shadow-sm transition-all hover:bg-fd-accent"
    >
      {props.children}
    </Link>
  );
}
