import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/globals.css';
import '@/styles/prosemirror.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/transcript-seeker">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
