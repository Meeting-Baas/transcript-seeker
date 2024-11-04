import Image from "next/image";

export function Testimonials(): React.ReactElement {
    return (
      <div className="relative flex flex-col items-center overflow-hidden pb-4 px-4 md:px-6 border-x">
        <div className="rounded-xl border bg-fd-muted p-4 shadow-sm w-full">
          <p className="text-sm font-medium">
            {`"It's magnificent!! I absolutely want something like this for [company]. The presentation is so clean and well-executed."`}
          </p>
          <div className="mt-4 flex flex-row items-center gap-2">
            <Image
              src="https://avatars.githubusercontent.com/u/9919"
              alt="avatar"
              width="32"
              height="32"
              className="size-8 rounded-full"
            />
            <div>
              <a
                href="https://meetingbaas.com"
                rel="noreferrer noopener"
                className="text-sm font-medium"
              >
                Philippe Drion
              </a>
              <p className="text-xs text-fd-muted-foreground">
                Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  