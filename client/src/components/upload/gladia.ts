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
      return pollResponse.result.transcription;
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

export async function startTranscription(audio_url: string, gladiaKey: string) {
  const requestData = {
    audio_url: audio_url,
    diarization: true,
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
