import { ThemeProvider } from '@/components/theme-provider';
import Join from '@/routes/join';
import Layout from '@/routes/layout';
import NotFound from '@/routes/not-found';
import Meeting from '@/routes/recording';
import Recordings from '@/routes/recordings';
import Root from '@/routes/root';
import Settings from '@/routes/settings';
import Upload from '@/routes/upload';
import Calendars from '@/routes/calendars';
import Login from '@/routes/login';

import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@meeting-baas/ui/sonner';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Root />} />
          <Route path="login" element={<Login />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="meetings" element={<Calendars />} />
          <Route path="join" element={<Join />} />
          <Route path="upload" element={<Upload />} />
          <Route path="/meeting/:botId" element={<Meeting />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
