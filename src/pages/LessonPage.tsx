import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataStore, delay } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Course, Lesson, Progress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Loader2,
  BookOpen,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      const foundCourse = dataStore.courses.find(c => c.id === courseId);
      if (!foundCourse) {
        navigate('/courses');
        return;
      }

      const courseLessons = dataStore.lessons
        .filter(l => l.courseId === courseId)
        .sort((a, b) => a.orderNumber - b.orderNumber);

      const lesson = courseLessons.find(l => l.id === lessonId);
      if (!lesson) {
        navigate(`/courses/${courseId}`);
        return;
      }

      setCourse(foundCourse);
      setLessons(courseLessons);
      setCurrentLesson(lesson);

      if (user) {
        const userProgress = dataStore.progress.find(
          p => p.studentId === user.id && p.courseId === courseId
        );
        setProgress(userProgress || null);
      }

      setIsLoading(false);
    };

    loadData();
  }, [courseId, lessonId, user, navigate]);

  const markAsCompleted = async () => {
    if (!user || !currentLesson || !courseId) return;

    await delay(200, 400);

    let userProgress = dataStore.progress.find(
      p => p.studentId === user.id && p.courseId === courseId
    );

    if (userProgress) {
      if (!userProgress.completedLessonIds.includes(currentLesson.id)) {
        userProgress.completedLessonIds.push(currentLesson.id);
        userProgress.percent = Math.round(
          (userProgress.completedLessonIds.length / lessons.length) * 100
        );
        userProgress.lastAccessedAt = new Date().toISOString();
        setProgress({ ...userProgress });

        toast({
          title: 'Lección completada',
          description: `Has completado "${currentLesson.title}"`,
        });
      }
    }
  };

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCompleted = progress?.completedLessonIds.includes(currentLesson?.id || '');

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const LessonsList = () => (
    <div className="space-y-1">
      {lessons.map((lesson, index) => {
        const lessonCompleted = progress?.completedLessonIds.includes(lesson.id);
        const isCurrent = lesson.id === lessonId;

        return (
          <Link
            key={lesson.id}
            to={`/courses/${courseId}/lesson/${lesson.id}`}
            className={cn(
              'flex items-center gap-3 rounded-lg p-3 text-sm transition-colors',
              isCurrent
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                lessonCompleted
                  ? 'bg-success text-success-foreground'
                  : isCurrent
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {lessonCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className="line-clamp-1">{lesson.title}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild className="-ml-2">
          <Link to={`/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al curso
          </Link>
        </Button>

        {/* Mobile lesson menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <Menu className="h-4 w-4 mr-2" />
              Lecciones
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Contenido del curso</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <LessonsList />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{course.title}</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{progress?.percent || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress?.percent || 0}%` }}
                  />
                </div>
              </div>
              <LessonsList />
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Lección {currentIndex + 1} de {lessons.length}
            </p>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">
              {currentLesson.title}
            </h1>
            {currentLesson.duration && (
              <p className="text-muted-foreground mt-1">{currentLesson.duration}</p>
            )}
          </div>

          {/* Lesson content */}
          <Card>
            <CardContent className="p-6 lg:p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* Render markdown-like content */}
                {currentLesson.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={i} className="text-2xl font-bold mt-6 mb-4 first:mt-0">
                        {line.slice(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={i} className="text-xl font-semibold mt-6 mb-3">
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (line.startsWith('```')) {
                    return null; // Skip code block markers
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-4">
                        {line.slice(2)}
                      </li>
                    );
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link to={`/courses/${courseId}/lesson/${prevLesson.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Link>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {!isCompleted && (
                <Button onClick={markAsCompleted}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como completada
                </Button>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completada</span>
                </div>
              )}
            </div>

            {nextLesson ? (
              <Button asChild>
                <Link to={`/courses/${courseId}/lesson/${nextLesson.id}`}>
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to={`/courses/${courseId}`}>
                  Volver al curso
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
