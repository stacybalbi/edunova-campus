import { Link } from 'react-router-dom';
import type { Course, User } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dataStore } from '@/lib/api';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
  showTeacher?: boolean;
}

export function CourseCard({ course, enrolled, progress, showTeacher = true }: CourseCardProps) {
  const teacher = dataStore.users.find(u => u.id === course.teacherId);
  const enrollmentCount = dataStore.enrollments.filter(e => e.courseId === course.id).length;

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'Intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'Beginner':
        return 'Principiante';
      case 'Intermediate':
        return 'Intermedio';
      case 'Advanced':
        return 'Avanzado';
      default:
        return level;
    }
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group h-full overflow-hidden card-hover border-border/50">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Category badge */}
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm"
          >
            {course.category}
          </Badge>

          {/* Enrolled badge */}
          {enrolled && (
            <Badge
              className="absolute right-3 top-3 bg-success text-success-foreground"
            >
              Inscrito
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {/* Teacher */}
          {showTeacher && teacher && (
            <div className="mt-3 flex items-center gap-2">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm text-muted-foreground">{teacher.name}</span>
            </div>
          )}

          {/* Progress bar (if enrolled) */}
          {enrolled && progress !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium text-primary">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {course.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {enrollmentCount}
              </span>
            </div>
            {course.level && (
              <Badge variant="outline" className={cn('text-xs', getLevelColor(course.level))}>
                {getLevelLabel(course.level)}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
