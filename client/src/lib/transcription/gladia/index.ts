import { Transcript } from '@/types';

export async function makeFetchRequest(url: string, options: any) {
  const response = await fetch(url, options);
  return response.json();
}

export async function pollForResult(resultUrl: string, headers: any) {
  while (true) {
    console.log('polling for results...');
    const pollResponse = await makeFetchRequest(resultUrl, { headers });

    if (pollResponse.status === 'done') {
      console.log('transcription done: \n ');
      console.log(pollResponse.result.transcription.full_transcript);
      return pollResponse.result;
      break;
    } else {
      console.log('transcription status : ', pollResponse.status);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export async function uploadFile(blob: Blob, apiToken: string) {
  const formData = new FormData();
  formData.append('audio', blob, 'conversation.wav');

  const response = await fetch('https://api.gladia.io/v2/upload', {
    method: 'POST',
    headers: {
      'x-gladia-key': apiToken,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function startTranscription(
  audio_url: string,
  gladiaKey: string,
  options?: {
    [key: string]: unknown;
  },
) {
  const requestData = {
    audio_url: audio_url,
    ...options,
  };
  const gladiaUrl = 'https://api.gladia.io/v2/transcription/';
  const headers = {
    'x-gladia-key': gladiaKey,
    'Content-Type': 'application/json',
  };

  console.log('- Sending initial request to Gladia API...');
  const initialResponse = await makeFetchRequest(gladiaUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestData),
  });

  console.log('Initial response with Transcription ID :', initialResponse);

  if (initialResponse.result_url) {
    const result = await pollForResult(initialResponse.result_url, headers);
    return result;
  }
}

export interface GladiaUtterance {
  speaker: number;
  words: {
    start: number;
    end: number;
    word: string;
  }[];
}

export function groupUtterancesBySpeaker(
  utterances: GladiaUtterance[]
): Transcript[] {
  let groupedTranscripts: Transcript[] = [];
  let currentSpeaker: number | null = null;
  let currentWords: Transcript['words'] = [];
  let currentWordCount = 0;

  utterances.forEach((utterance) => {
    if (currentSpeaker === null || currentSpeaker !== utterance.speaker || currentWordCount >= 75) {
      if (currentWords.length > 0) {
        groupedTranscripts.push({
          speaker: `Speaker ${currentSpeaker ? currentSpeaker + 1 : ''}`,
          words: currentWords,
        });
      }
      currentSpeaker = utterance?.speaker || 0;
      currentWords = [];
      currentWordCount = 0;
    }

    utterance.words.forEach((word) => {
      currentWords.push({
        start_time: word.start,
        end_time: word.end,
        text: word.word.trim(),
      });
      currentWordCount++;

      if (currentWordCount >= 75) {
        groupedTranscripts.push({
          speaker: `Speaker ${currentSpeaker! + 1}`,
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
      speaker: `Speaker ${currentSpeaker! + 1}`,
      words: currentWords,
    });
  }

  return groupedTranscripts;
}

export async function transcribe(
  blob: Blob,
  apiToken: string,
  options?: {
    [key: string]: unknown;
  },
) {
  const uploadURL = await uploadFile(blob, apiToken);
  const data = await startTranscription(uploadURL.audio_url, apiToken, options);

  const transcription: {
    utterances: GladiaUtterance[];
  } = data.transcription;
  let transcript = groupUtterancesBySpeaker(transcription.utterances);

  return { data: data, transcript: transcript };
}
