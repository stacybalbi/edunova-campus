import { useEffect, useState } from 'react';
import { dataStore, delay } from '@/lib/api';
import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCoursesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);
      setCourses([...dataStore.courses]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Todos los Cursos</h1>
        <p className="text-muted-foreground mt-1">Vista administrativa de todos los cursos</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Cursos ({courses.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.map((course) => {
              const teacher = dataStore.users.find(u => u.id === course.teacherId);
              const enrollments = dataStore.enrollments.filter(e => e.courseId === course.id).length;
              return (
                <Link key={course.id} to={`/courses/${course.id}`} className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <img src={course.thumbnail} alt={course.title} className="h-16 w-24 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{course.title}</p>
                      <p className="text-sm text-muted-foreground">Por: {teacher?.name || 'Desconocido'}</p>
                    </div>
                    <Badge variant="secondary">{course.category}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{enrollments}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
