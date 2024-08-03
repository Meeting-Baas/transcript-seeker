import { Transcript } from '@/types';
import { createClient } from '@deepgram/sdk';
import { DeepgramTranscriptionOptions } from './options';

function groupUtterancesBySpeaker(utterances: any[]): Transcript[] {
  let groupedTranscripts: Transcript[] = [];
  let currentWords: Transcript['words'] = [];
  let currentWordCount = 0;

  utterances.forEach((utterance) => {
    utterance.words.forEach((word: any) => {
      currentWords.push({
        start_time: word.start,
        end_time: word.end,
        text: word.word.trim(),
      });
      currentWordCount++;

      if (currentWordCount >= 75) {
        groupedTranscripts.push({
          speaker: `Speaker ${word.speaker}`,
          words: currentWords,
        });
        currentWords = [];
        currentWordCount = 0;
      }
    });
  });

  // Add any remaining words
  if (currentWords.length > 0) {
    groupedTranscripts.push({
      // speaker: `Speaker ${currentWords[currentWords.length - 1].speaker || 'Unknown'}`,
      speaker: `Speaker`,
      words: currentWords,
    });
  }

  return groupedTranscripts;
}

export const transcribe = async (
  blob: Blob,
  apiKey: string,
  options?: DeepgramTranscriptionOptions,
): Promise<{
  data: { summarization?: { results: string } };
  transcript: Transcript[];
}> => {
  const deepgram = createClient(apiKey);

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(buffer, {
    ...options,
  });

  if (error) {
    console.error('Oops, something went wrong!', error);
    throw error;
  }

  const transcript = groupUtterancesBySpeaker(result.results.utterances || []);

  return {
    data: {
      ...(options?.summarize
        ? {
            summarization: {
              results: result.results.summary?.result || '',
            },
          }
        : {}),
    },
    transcript: transcript,
  };
};
