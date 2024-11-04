import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  AlbumIcon,
  Book,
  ComponentIcon,
  Heart,
  Layout,
  LayoutTemplate,
  Pencil,
  Server,
} from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "Transcript Seeker",
    transparentMode: "top",
  },
  links: [
    {
      type: "menu",
      text: "Documentation",
      url: "/docs",
      items: [
        {
          menu: {
            className: "md:row-span-2",
          },
          icon: <Book />,
          text: "Getting Started",
          description: "Learn to use Fumadocs on your docs site.",
          url: "/docs",
        },
      ],
    },
  ],
};
