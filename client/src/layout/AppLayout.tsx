import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../features/sidebar/Sidebar';
import TopBar from '../components/ui/TopBar';

export default function AppLayout() {
  const [activeView, setActiveView] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
  <div className="bg-background text-foreground min-h-screen">

      {/* TopBar floats over everything */}
      <TopBar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar fixed on left */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

      {/* Main content below TopBar and next to Sidebar */}
      <div className="pt-16 md:pl-64">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
