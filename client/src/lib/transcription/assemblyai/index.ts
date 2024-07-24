import { Transcript } from '@/types';
import { AssemblyAI, TranscriptUtterance as AssemblyAIUtterance } from 'assemblyai';

export async function makeFetchRequest(url: string, options: any) {
  const response = await fetch(url, options);
  return response.json();
}

export function groupUtterancesBySpeaker(utterances: AssemblyAIUtterance[]): Transcript[] {
  let groupedTranscripts: Transcript[] = [];
  let currentSpeaker: string | null = null;
  let currentWords: Transcript['words'] = [];
  let currentWordCount = 0;

  utterances.forEach((utterance) => {
    if (!utterance.words) return;
    utterance.words.forEach((word) => {
      currentWords.push({
        start_time: word.start / 1000,
        end_time: word.end / 1000,
        text: word.text.trim(),
      });
      currentWordCount++;

      if (currentWordCount >= 75) {
        groupedTranscripts.push({
          speaker: `Speaker ${word.speaker}`,
          words: currentWords,
        });
        currentSpeaker = word.speaker || null;
        currentWords = [];
        currentWordCount = 0;
      }
    });
  });

  // Add any remaining words
  if (currentWords.length > 0) {
    groupedTranscripts.push({
      speaker: `Speaker ${currentSpeaker!}`,
      words: currentWords,
    });
  }

  return groupedTranscripts;
}

const transcribe = async (
  blob: Blob,
  apiToken: string,
  options?: {
    [key: string]: unknown;
  },
) => {
  const client = new AssemblyAI({
    apiKey: apiToken,
  });

  const uploadURL = await client.files.upload(blob);
  const params = {
    audio: uploadURL,
    speaker_labels: true,
  };

  console.log(options)
  const transcript = await client.transcripts.transcribe(params);
  if (!transcript) console.error('Oops, something went wrong!', transcript);
  return groupUtterancesBySpeaker(transcript.utterances!);
};

export { transcribe };
