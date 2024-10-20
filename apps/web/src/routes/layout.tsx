import Footer from '@/components/footer';
import ReloadPrompt from '@/components/reload-prompt';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* An <Outlet> renders whatever child route is currently active,
              so you can think about this <Outlet> as a placeholder for
              the child routes we defined above. */}
        <Outlet />
        <ReloadPrompt />
      </main>
      <Footer />
    </div>
  );
}
