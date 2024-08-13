import { Transcript } from '.';

export type Meeting = {
    id: string;
    name: string;
    bot_id: string;
    attendees: string[];
    data?: MeetingInfo;
    createdAt: Date;
    status: 'loaded' | 'loading' | 'error';
};

export type MeetingInfo = {
    id: string;
    name: string;
    editors: [
        {
            video: {
                transcripts: Transcript[];
            };
        },
    ];
    attendees: [{ name: string }];
    assets: [
        {
            // TODO : NEVER DO THAT. First, yhe field name is mp4_s3_path, it contains the 'path' word, not 'data'.
            // FIXED?
            // Second, this field comme from Spoke API, it is a string, it must never change his shape to Blob
            // or other data types
            mp4_s3_path: string;
            mp4_blob?: Blob;
        },
    ];
    created_at: {
        secs_since_epoch: number;
        nanos_since_epoch: number;
    };
};
