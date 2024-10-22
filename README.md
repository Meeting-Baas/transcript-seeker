# Transcript Seeker

![Header](./.github/images/transcript-seeker.png)

## Overview

Open-source transcription playground powered by transcription APIs and meeting bot API technology. <br/>
Upload and store recordings, or use our meeting bot transcription API to record Google Meet, Microsoft Teams and Zoom: <br/>

- Transcribe recordings.
- Chat with transcripts using LLMs.
- Create notes for recordings.
- And more.

Running directly in your browser using [PGLite](https://pglite.dev/).

## Key Features

- Upload video/audio recordings, transcribe them using our meeting transcription API
- Get a transcript synced to your recording. Click on a word to jump through the recording.
- Generate recordings with meta-data on Zoom, Google Meet, Teams, using [Meeting Baas' 🐟](https://meetingbaas.com) meeting bot API.
- Chat with transcripts via OpenAI
- Add notes to recordings, or automatically add AI summaries of transcripts as a note, as soon as you upload a file.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- Media Playback: Vidstack
- Proxy: Express (w/Node Http Proxy)

## Quick Start

1. Clone the repo:

   ```
   npx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
   ```

2. Copy the .env.example to .env

   ```
   cp .env.example .env
   ```

5. Run using just the front-end, without adding variables in .env necessary for now:
   ```
   pnpm run dev
   ```

## Contributing

Open a PR. Looking for ideas? Checkout the [to-do list](./TODO.md)

## License

MIT License

## Support

Open an issue or join our [Discord](https://discord.com/invite/dsvFgDTr6c).

## Acknowledgements

- [Meeting Baas API](https://meetingbaas.com/) - Our meeting bot API and meeting transcription API provider
- [Vidstack](https://www.vidstack.io/) - UI components and hooks for building media players on the web. 
- [PGLite](https://pglite.dev/) - A fullly fledged Postgres database locally in WASM with reactivity and live sync.
- [Drizzle ORM](https://orm.drizzle.team) - An ORM for you to ship