import Footer from '@/components/footer';
import ReloadPrompt from '@/components/reload-prompt';
import TabManager from '@/components/tab-manager';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <Outlet />
        <TabManager />
        <ReloadPrompt />
      </main>
    </div>
  );
}
