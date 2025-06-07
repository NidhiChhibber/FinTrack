import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../context/AppProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile/Tablet Top Bar */}
      <div className="lg:hidden">
        <TopBar />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6">
            {state.isLoading && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {state.error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{state.error}</p>
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <Sidebar isMobile />
      </div>
    </div>
  );
};

export default Layout;