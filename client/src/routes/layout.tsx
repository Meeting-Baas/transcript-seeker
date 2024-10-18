import Footer from '@/components/footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    // <div className="flex flex-col min-h-screen p-2"></div>
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* An <Outlet> renders whatever child route is currently active,
              so you can think about this <Outlet> as a placeholder for
              the child routes we defined above. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
