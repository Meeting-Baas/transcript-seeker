import { ThemeProvider } from '@/components/theme-provider';
import Join from '@/routes/join';
import Layout from '@/routes/layout';
import NotFound from '@/routes/not-found';
import Meeting from '@/routes/recording';
import Recordings from '@/routes/recordings';
import Root from '@/routes/root';
import Settings from '@/routes/settings';
import Upload from '@/routes/upload';
import { Route, Routes } from 'react-router-dom';

import { Toaster } from '@meeting-baas/ui/sonner';
import { WebSocketDemo } from './routes/ws';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Root />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="join" element={<Join />} />
          <Route path="upload" element={<Upload />} />
          <Route path="ws" element={<WebSocketDemo />} />
          <Route path="/meeting/:botId" element={<Meeting />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
