export interface Transcript {
  speaker: string;
  words: {
    start_time: number;
    end_time: number;
    text: string;
  }[];
}

export interface Message {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

export interface Chat {
  id: string;
  messages?: Message[];
}

// todo: don't duplicate shared types
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

export interface CalendarBaasData {
  google_id: string;
  name: string;
  email: string;
  resource_id: string | null;
  uuid: string;
};

export interface CalendarBaasEvent {
  google_id: string;
  name: string;
  meeting_url: string;
  start_time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  end_time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  is_organizer: boolean;
  recurring_event_id: string | null;
  is_recurring: boolean;
  uuid: string;
  raw: {
    
  };
  bot_param: any | null;
};
