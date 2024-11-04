"use client";

import { OramaClient } from "@oramacloud/client";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import SearchDialog from "fumadocs-ui/components/dialog/search-orama";

// todo: use t3 env
const client = new OramaClient({
  endpoint: process.env.NEXT_PUBLIC_ORAMA_ENDPOINT!,
  api_key: process.env.NEXT_PUBLIC_ORAMA_API_KEY!,
});

export default function CustomSearchDialog(props: SharedProps) {
  return <SearchDialog {...props} client={client} showOrama />;
}
