// shared/src/api.ts
import process from "node:process";
import axios from "axios";

export interface JoinMeetingParams {
  meetingBotName?: string;
  meetingURL: string;
  meetingBotImage?: string;
  meetingBotEntryMessage?: string;
  apiKey: string;
}

export interface JoinMeetingResult {
  bot_id: string;
}

export const DEFAULT_BOT_NAME = "Baas Meeting Bot";
export const DEFAULT_ENTRY_MESSAGE = "Hello 🐟 - recording this meeting.";
export const DEFAULT_BOT_IMAGE =
  "https://meetingbaas.com/static/a7d46fd33668f28baa9cbf66005489f0/a6312/preview.png";
export const DEFAULT_SPEECH_TO_TEXT = "Gladia";

export async function joinMeeting({
  meetingBotName,
  meetingURL,
  meetingBotImage,
  meetingBotEntryMessage,
  apiKey,
  proxyUrl,
}: JoinMeetingParams & { proxyUrl?: string }): Promise<{
  data?: JoinMeetingResult;
  error?: string;
}> {
  try {
    const url = proxyUrl
      ? `${proxyUrl}/bots`
      : (process.env.VITE_MEETINGBASS_API_URL ??
          "https://api.meetingbaas.com") + "/bots";

    const response = await axios.post(
      url,
      {
        meeting_url: meetingURL,
        bot_name: meetingBotName || DEFAULT_BOT_NAME,
        entry_message: meetingBotEntryMessage || DEFAULT_ENTRY_MESSAGE,
        bot_image: meetingBotImage || DEFAULT_BOT_IMAGE,
        speech_to_text: "Gladia",
        reserved: false,
      },
      {
        headers: {
          "x-spoke-api-key": apiKey,
        },
      },
    );

    console.log(`New bot created, with id: ${response.data?.bot_id}`);
    return { data: response.data };
  } catch (error: any) {
    console.error("Error joining meeting:", error);
    return { error: error.message || "Unknown error" };
  }
}

export interface BotDetailsParams {
  botId: string;
  apiKey: string;
  proxyUrl?: string;
}
export async function fetchBotDetails({
  botId,
  apiKey,
  proxyUrl,
}: BotDetailsParams) {
  try {
    const url = proxyUrl
      ? proxyUrl
      : "https://api.meetingbaas.com/bots/meeting_data";

    const response = await axios.get(url, {
      params: {
        bot_id: botId,
      },
      headers: {
        "x-spoke-api-key": apiKey,
      },
    });

    console.log(`bot details fetched, with id: ${response.data?.id}`);
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching meeting:", error);
    return { error: error.message || "Unknown error" };
  }
}