import { Transcript } from './transcript';

export interface Bot {
  id: number;
  account_id: number;
  meeting_url: string;
  bot_name: string;
  bot_image: string | null;
  speech_to_text_provider: string | null;
  speech_to_text_api_key: string | null;
  streaming_input: string | null;
  streaming_output: string | null;
  created_at: number;
  session_id: string | null;
  reserved: boolean;
  errors: string | null;
  ended_at: number | null;
  enter_message: string | null;
  mp4_s3_path: string;
  webhook_url: string;
  uuid: string;
  recording_mode: string;
}

export interface BotData {
  bot: Bot | null;
  transcripts: Transcript[];
}

export interface MeetingData {
  name: string;
  bot_data: BotData;
  mp4: string;
}
