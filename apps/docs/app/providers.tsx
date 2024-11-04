"use client";

import { RootProvider } from "fumadocs-ui/provider";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SidebarProvider } from "fumadocs-core/sidebar";

const SearchDialog = dynamic(() => import("@/components/search"), {
  ssr: false,
});

export function Providers({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </RootProvider>
  );
}
