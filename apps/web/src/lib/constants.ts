export const VITE_PROXY_URL = import.meta.env.VITE_PROXY_URL;
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
