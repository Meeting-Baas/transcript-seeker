import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@meeting-baas/ui/button";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

// todo: fix this later, the day is not properly mapping
const events = [
  {
    day: 1,
    start: 10,
    end: 12,
    title: "Team Meeting",
  },
  {
    day: 3,
    start: 14,
    end: 16,
    title: "Project Review",
  },
  {
    day: 5,
    start: 9,
    end: 11,
    title: "Client Call",
  },
];

const calendarItemVariants = cva(
  "absolute flex flex-col gap-2 overflow-hidden  gap-2 rounded-md px-1 py-0.5 text-xs text-fd-popover-foreground hover:bg-fd-accent transition-colors",
);

export default function MockupCalendar() {
  return (
    <div className="w-full p-px bg-gradient-to-b from-fd-border rounded-lg ">
      <div className="flex select-none flex-col rounded-[inherit] bg-gradient-to-b from-fd-popover">
        <div className="p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">November 5 - 11, 2023</h2>
            <div className="flex items-center gap-2">
              <button
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "rounded-[inherit] h-auto w-auto p-1",
                })}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "h-auto w-auto p-1 rounded-[inherit]",
                })}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs font-medium">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center">
                {day}
                <div className="text-lg mt-1">{index + 5}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[300px] mt-4 rounded-xl overflow-auto">
          <div className="grid grid-cols-8 gap-1">
            <div className="col-span-1">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-12 text-[10px] text-right pr-2 pt-1 text-fd-muted-foreground"
                >
                  {hour.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
            {weekDays.map((_, dayIndex) => (
              <div key={dayIndex} className="col-span-1 relative">
                {hours.map((hour) => (
                  <div key={hour} className="h-12 border-t border-border"></div>
                ))}
                {events
                  .filter((event) => event.day === dayIndex)
                  .map((event, i) => (
                    <div
                      key={i}
                      className={cn(
                        calendarItemVariants({
                          className: i === 0 ? "bg-fd-accent" : "",
                        }),
                      )}
                      // className={`absolute left-1 right-1 bg-gradient-to-r ${event.color} text-white rounded-lg p-1 text-[10px] shadow-sm overflow-hidden`}
                      style={{
                        top: `${event.start * 12}px`,
                        height: `${(event.end - event.start) * 12}px`,
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
