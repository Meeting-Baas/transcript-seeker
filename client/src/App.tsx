import Join from '@/routes/join';
import Layout from '@/routes/layout';
import Meeting from '@/routes/meeting';
import Meetings from '@/routes/meetings';
import NotFound from '@/routes/not-found';
import Root from '@/routes/root';
import Settings from '@/routes/settings';
import Upload from '@/routes/upload';

import { Route, Routes } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { Provider } from 'jotai';

export const VITE_SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL || '/api';

export default function App() {
  return (
    <Provider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Root />} />
          <Route path="join" element={<Join />} />
          <Route path="upload" element={<Upload />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/meeting/:botId" element={<Meeting />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Provider>
  );
}
