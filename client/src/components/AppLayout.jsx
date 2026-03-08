import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarProvider } from './Sidebar';

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
