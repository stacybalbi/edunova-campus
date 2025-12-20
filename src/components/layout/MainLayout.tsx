import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Topbar } from './Topbar';
import { Breadcrumbs } from './Breadcrumbs';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <Topbar collapsed={sidebarCollapsed} />
      
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="container py-6">
          <Breadcrumbs className="mb-6" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
