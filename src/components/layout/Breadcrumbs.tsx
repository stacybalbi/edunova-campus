import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route to label mapping
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Cursos',
  'my-courses': 'Mis Cursos',
  progress: 'Progreso',
  grades: 'Calificaciones',
  teacher: 'Profesor',
  admin: 'Administración',
  users: 'Usuarios',
  manage: 'Gestionar',
  quiz: 'Quiz',
  lesson: 'Lección',
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    return paths.map((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === paths.length - 1;
      
      // Check if segment is an ID (starts with course-, lesson-, etc.)
      const isId = segment.includes('-') && !routeLabels[segment];
      const label = isId ? segment.split('-').slice(0, 2).join(' ') : (routeLabels[segment] || segment);
      
      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: isLast ? undefined : currentPath,
      };
    });
  })();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      <Link
        to="/dashboard"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
