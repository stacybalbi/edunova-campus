import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, delay } from '@/lib/api';
import type { Submission, Quiz, Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Award, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function GradesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<
    {
      submission: Submission;
      quiz: Quiz;
      course: Course;
    }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      if (user) {
        const userSubmissions = dataStore.submissions.filter(s => s.studentId === user.id);
        const data = userSubmissions
          .map((submission) => {
            const quiz = dataStore.quizzes.find(q => q.id === submission.quizId);
            const course = quiz ? dataStore.courses.find(c => c.id === quiz.courseId) : null;
            if (quiz && course) {
              return { submission, quiz, course };
            }
            return null;
          })
          .filter(Boolean) as { submission: Submission; quiz: Quiz; course: Course }[];

        // Sort by date (newest first)
        data.sort(
          (a, b) =>
            new Date(b.submission.submittedAt).getTime() -
            new Date(a.submission.submittedAt).getTime()
        );

        setSubmissions(data);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const averageScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.submission.score / s.submission.maxScore) * 100, 0) /
            submissions.length
        )
      : 0;

  const passedCount = submissions.filter(
    s => (s.submission.score / s.submission.maxScore) * 100 >= 60
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
        <h1 className="font-display text-3xl font-bold text-foreground">
          Mis Calificaciones
        </h1>
        <p className="mt-1 text-muted-foreground">
          Historial de evaluaciones y resultados
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio General</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
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
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold">{passedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-3">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Historial de Evaluaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No has completado ninguna evaluación todavía</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Explorar cursos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map(({ submission, quiz, course }) => {
                const percentage = Math.round(
                  (submission.score / submission.maxScore) * 100
                );
                const passed = percentage >= 60;

                return (
                  <Link
                    key={submission.id}
                    to={`/courses/${course.id}/quiz/${quiz.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0',
                          passed ? 'bg-success/10' : 'bg-destructive/10'
                        )}
                      >
                        {passed ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{quiz.title}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              passed
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-destructive/10 text-destructive border-destructive/20'
                            )}
                          >
                            {passed ? 'Aprobado' : 'No aprobado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{course.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(submission.submittedAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            'text-2xl font-bold',
                            passed ? 'text-success' : 'text-destructive'
                          )}
                        >
                          {percentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submission.score}/{submission.maxScore}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
