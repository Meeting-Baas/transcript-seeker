export interface Word {
  start_time: number;
  end_time: number;
  text: string;
}

export interface Transcript {
  speaker: string;
  words: Word[];
}
