import TabManager from '@/components/tab-manager';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <Outlet />
        <TabManager />
      </main>
    </div>
  );
}
