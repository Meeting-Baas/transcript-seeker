export const VITE_PROXY_URL = import.meta.env.VITE_PROXY_URL;
export const VITE_API_URL = import.meta.env.VITE_API_URL;
export const VITE_WEB_URL = import.meta.env.VITE_WEB_URL;
export const VITE_S3_PREFIX = import.meta.env.VITE_S3_PREFIX;
export const PROFILE = import.meta.env.VITE_PROFILE;

export const LOADING_EDITOR_DATA = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Loading...',
        },
      ],
    },
  ],
};

export const BLANK_EDITOR_DATA = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Nothing here yet!',
        },
      ],
    },
  ],
};
