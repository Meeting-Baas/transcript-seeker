# Transcript Seeker

![Header](./../../GithubPreview.png)

## Overview

Open-source transcription playground. <br/> 
Upload and store recordings, transcribe them. Chat with transcripts using LLMs, annotate recordings, and record Zoom, Google Meet and Microsoft Teams using meeting bots.

Running directly in your browser using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). 

## Key Features

- Upload video/audio recordings, transcribe them using the transcription API of your choice
- Get a transcript synced to your recording. Click on a word to jump through the recording. 
- Generate recordings with meta-data on Zoom, Google Meet, Teams, using [Meeting Baas' 🐟](https://meetingbaas.com) API. 
- Chat with transcripts via OpenAI
- Add notes to recordings, or automatically add AI summaries of transcripts as a note, as soon as you upload a file. 
- Standalone mode with browser Local Storage

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- Media Playback: Vidstack

## Quick Start

1. Clone the repo:
   ```
   git clone https://github.com/Meeting-Baas/transcript-seeker
   cd transcript-seeker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build and run dev mode:
   ```
   npm run dev
   ```

## Contributing

Open a PR. Looking for ideas? Checkout the [to-do list](./TODO.md)

## License

MIT License

## Support

Open an issue or join our [Discord](https://discord.com/invite/dsvFgDTr6c).

## Acknowledgements

- [Meeting Baas API](https://meetingbaas.com/)
- [Vidstack](https://www.vidstack.io/)
