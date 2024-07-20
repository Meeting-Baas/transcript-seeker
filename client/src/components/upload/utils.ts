export async function extractAudio(file: ArrayBuffer): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || window.AudioContext)();
  const sampleRate = 16000;
  const numberOfChannels = 1;

  try {
    const decodedAudioData = await audioContext.decodeAudioData(file);
    const duration = decodedAudioData.duration;

    const offlineAudioContext = new OfflineAudioContext(
      numberOfChannels,
      sampleRate * duration,
      sampleRate,
    );

    const soundSource = offlineAudioContext.createBufferSource();
    soundSource.buffer = decodedAudioData;

    soundSource.connect(offlineAudioContext.destination);
    soundSource.start();

    const renderedBuffer = await offlineAudioContext.startRendering();
    return renderedBuffer;
  } catch (error) {
    console.error('Audio processing failed: ', error);
    throw error;
  }
}

export function convertToBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('File reading result is not an ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
}
