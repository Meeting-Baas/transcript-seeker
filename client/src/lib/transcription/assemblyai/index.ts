import { Transcript } from '@/types';
import { AssemblyAI, TranscriptUtterance as AssemblyAIUtterance } from 'assemblyai';

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
        currentSpeaker = word.speaker || 'Unknown';
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
  apiKey: string,
  options?: {
    [key: string]: unknown;
  },
) => {
  const client = new AssemblyAI({
    apiKey,
  });

  console.log(options, {
    ...(options?.summarization ? options.summarization : {}),
  });
  const uploadURL = await client.files.upload(blob);
  const params = {
    audio: uploadURL,
    ...options,
    ...(options?.summarization ? options.summarization : {}),
  };

  console.log(options);
  const transcription = await client.transcripts.transcribe(params);
  if (!transcription) console.error('Oops, something went wrong!', transcription);

  let transcript = groupUtterancesBySpeaker(
    transcription.utterances
      ? transcription.utterances
      : [
          {
            confidence: 0,
            end: 0,
            speaker: 'Unknown',
            start: 0,
            text: transcription.text!,
            words: transcription.words!,
          },
        ],
  );

  return {
    data: {
      ...(options?.summarization
        ? {
            summarization: {
              results: transcription.summary,
            },
          }
        : {}),
    },
    transcript: transcript,
  };
};

export { transcribe };
