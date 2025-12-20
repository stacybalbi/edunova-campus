import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, delay } from '@/lib/api';
import type { Course, Progress as ProgressType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ProgressPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<
    {
      course: Course;
      progress: ProgressType;
      totalLessons: number;
    }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      if (user) {
        const userProgress = dataStore.progress.filter(p => p.studentId === user.id);
        const data = userProgress
          .map((p) => {
            const course = dataStore.courses.find(c => c.id === p.courseId);
            const totalLessons = dataStore.lessons.filter(l => l.courseId === p.courseId).length;
            if (course) {
              return { course, progress: p, totalLessons };
            }
            return null;
          })
          .filter(Boolean) as { course: Course; progress: ProgressType; totalLessons: number }[];

        setProgressData(data);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const overallProgress =
    progressData.length > 0
      ? Math.round(
          progressData.reduce((sum, d) => sum + d.progress.percent, 0) / progressData.length
        )
      : 0;

  const completedCourses = progressData.filter(d => d.progress.percent === 100).length;
  const inProgressCourses = progressData.filter(
    d => d.progress.percent > 0 && d.progress.percent < 100
  ).length;

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
        <h1 className="font-display text-3xl font-bold text-foreground">Mi Progreso</h1>
        <p className="mt-1 text-muted-foreground">
          Revisa tu avance en todos tus cursos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progreso General</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-success/10 p-3">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cursos Completados</p>
                <p className="text-2xl font-bold">{completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold">{inProgressCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course progress list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detalle por Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progressData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tienes cursos con progreso registrado</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Explorar cursos</Link>
              </Button>
            </div>
          ) : (
            progressData.map(({ course, progress, totalLessons }) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {progress.completedLessonIds.length} de {totalLessons} lecciones
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          progress.percent === 100 ? 'text-success' : 'text-primary'
                        )}
                      >
                        {progress.percent}%
                      </span>
                    </div>
                  </div>
                  {progress.percent === 100 && (
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                  )}
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
