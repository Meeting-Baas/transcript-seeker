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
            s3_path: string,
            mp4_blob?: Blob;
        },
    ];
    created_at: {
        secs_since_epoch: number;
        nanos_since_epoch: number;
    };
};
