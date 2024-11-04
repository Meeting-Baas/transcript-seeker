import { cva } from "class-variance-authority";
import { ClockIcon } from "lucide-react";
import { FileTextIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const searchItemVariants = cva(
  "flex flex-col gap-2  gap-2 rounded-md px-4 py-3 text-sm text-fd-popover-foreground hover:bg-fd-accent transition-colors"
);

const searchTranscriptSnippets = [
  {
    id: 1,
    time: "00:03:24",
    speaker: "John",
    text: "So, moving on to our next agenda item, we need to discuss the project timeline.",
  },
  {
    id: 2,
    time: "00:05:12",
    speaker: "Sarah",
    text: "I have some concerns about the current deadline. I think we might need to adjust our expectations.",
  },
  {
    id: 3,
    time: "00:07:45",
    speaker: "Mike",
    text: "I agree with Sarah. The development team has encountered some unexpected challenges.",
  },
  {
    id: 4,
    time: "00:10:30",
    speaker: "Emily",
    text: "What specific challenges are we facing? Can we address them without pushing the deadline?",
  },
  {
    id: 5,
    time: "00:12:18",
    speaker: "John",
    text: "Good point, Emily. Mike, can you elaborate on the challenges your team is facing?",
  },
];

export default function MockupSearch(): React.ReactElement {
  return (
    <div className="mt-6 rounded-lg bg-gradient-to-b from-fd-border p-px">
      <div className="flex select-none flex-col rounded-[inherit] bg-gradient-to-b from-fd-popover">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-fd-muted-foreground">
          <SearchIcon className="size-4" />
          Search Transcripts...
        </div>
        <div className="border-t border-border p-2">
          <div className="h-[300px] overflow-auto">
            {searchTranscriptSnippets.map((snippet, i) => (
              <div
                key={snippet.id}
                className={cn(
                  searchItemVariants({
                    className: i === 0 ? "bg-fd-accent" : "",
                  })
                )}
              >
                <div className="flex items-center gap-3">
                  <FileTextIcon className="size-4 text-fd-muted-foreground" />
                  <div className="flex-1 flex flex-col">
                    <div className="font-medium">{snippet.speaker}</div>
                    <div className="text-xs text-fd-muted-foreground flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {snippet.time}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-fd-muted-foreground">
                  {snippet.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
