import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Award,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookMarked,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[];
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Cursos', href: '/courses', icon: BookOpen },
  { title: 'Mis Cursos', href: '/my-courses', icon: BookMarked, roles: ['STUDENT'] },
  { title: 'Progreso', href: '/progress', icon: BarChart3, roles: ['STUDENT'] },
  { title: 'Calificaciones', href: '/grades', icon: Award, roles: ['STUDENT'] },
];

const teacherNavItems: NavItem[] = [
  { title: 'Gestionar Cursos', href: '/teacher/courses', icon: ClipboardList, roles: ['TEACHER', 'ADMIN'] },
];

const adminNavItems: NavItem[] = [
  { title: 'Administración', href: '/admin', icon: ShieldCheck, roles: ['ADMIN'] },
  { title: 'Usuarios', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { title: 'Todos los Cursos', href: '/admin/courses', icon: BookOpen, roles: ['ADMIN'] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const filterByRole = (items: NavItem[]) => {
    return items.filter(item => {
      if (!item.roles) return true;
      return user && item.roles.includes(user.role);
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          active
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
            : 'text-sidebar-foreground/80'
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{item.title}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              EduNova
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {filterByRole(mainNavItems).map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        {user?.role === 'TEACHER' || user?.role === 'ADMIN' ? (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                Profesor
              </p>
            )}
            <div className="space-y-1">
              {filterByRole(teacherNavItems).map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </>
        ) : null}

        {user?.role === 'ADMIN' ? (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                Admin
              </p>
            )}
            <div className="space-y-1">
              {filterByRole(adminNavItems).map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </>
        ) : null}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        {user && (
          <div className={cn('mb-3 flex items-center gap-3', collapsed && 'justify-center')}>
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="h-9 w-9 rounded-full bg-sidebar-accent"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-sidebar-muted">{user.role}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-1">
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full text-sidebar-muted hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Cerrar sesión</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-sidebar-muted hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
