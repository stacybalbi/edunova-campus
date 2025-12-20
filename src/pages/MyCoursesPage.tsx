import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, delay } from '@/lib/api';
import type { Course, Progress as ProgressType } from '@/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<ProgressType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      if (user) {
        const enrollments = dataStore.enrollments.filter(e => e.studentId === user.id);
        const courses = enrollments
          .map(e => dataStore.courses.find(c => c.id === e.courseId))
          .filter(Boolean) as Course[];
        setEnrolledCourses(courses);

        const userProgress = dataStore.progress.filter(p => p.studentId === user.id);
        setProgress(userProgress);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const getProgressForCourse = (courseId: string) => {
    const p = progress.find(p => p.courseId === courseId);
    return p?.percent || 0;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Mis Cursos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona tus inscripciones y continúa tu aprendizaje
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled
              progress={getProgressForCourse(course.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No tienes cursos inscritos</h3>
            <p className="text-muted-foreground text-center mb-4">
              Explora nuestro catálogo y encuentra el curso perfecto para ti
            </p>
            <Button asChild>
              <Link to="/courses">Explorar cursos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
