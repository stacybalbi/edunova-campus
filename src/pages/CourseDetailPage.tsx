import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataStore, delay, generateId } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Course, Lesson, Quiz, Enrollment, Progress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  ClipboardList,
  CheckCircle,
  Loader2,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [teacher, setTeacher] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      const foundCourse = dataStore.courses.find(c => c.id === id);
      if (!foundCourse) {
        navigate('/courses');
        return;
      }

      setCourse(foundCourse);
      setLessons(
        dataStore.lessons
          .filter(l => l.courseId === id)
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );
      setQuizzes(dataStore.quizzes.filter(q => q.courseId === id));

      const foundTeacher = dataStore.users.find(u => u.id === foundCourse.teacherId);
      if (foundTeacher) {
        setTeacher({ name: foundTeacher.name, avatar: foundTeacher.avatar });
      }

      if (user) {
        const enrollment = dataStore.enrollments.find(
          e => e.studentId === user.id && e.courseId === id
        );
        setIsEnrolled(!!enrollment);

        const userProgress = dataStore.progress.find(
          p => p.studentId === user.id && p.courseId === id
        );
        setProgress(userProgress || null);
      }

      setIsLoading(false);
    };

    loadData();
  }, [id, user, navigate]);

  const handleEnroll = async () => {
    if (!user || !course) return;

    setIsEnrolling(true);
    await delay(400, 600);

    // Create enrollment
    const newEnrollment: Enrollment = {
      id: generateId('enrollment'),
      studentId: user.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString(),
    };
    dataStore.enrollments.push(newEnrollment);

    // Create progress record
    const newProgress: Progress = {
      id: generateId('progress'),
      studentId: user.id,
      courseId: course.id,
      completedLessonIds: [],
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    };
    dataStore.progress.push(newProgress);

    setIsEnrolled(true);
    setProgress(newProgress);
    setIsEnrolling(false);

    toast({
      title: '¡Inscripción exitosa!',
      description: `Te has inscrito en "${course.title}"`,
    });
  };

  const enrollmentCount = dataStore.enrollments.filter(
    e => e.courseId === course?.id
  ).length;

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

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Button variant="ghost" asChild className="-ml-2">
        <Link to="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a cursos
        </Link>
      </Button>

      {/* Course header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            {course.level && (
              <Badge variant="outline" className={getLevelColor(course.level)}>
                {getLevelLabel(course.level)}
              </Badge>
            )}
            {isEnrolled && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="mr-1 h-3 w-3" />
                Inscrito
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {course.title}
          </h1>

          <p className="text-lg text-muted-foreground">{course.description}</p>

          {/* Teacher */}
          {teacher && (
            <div className="flex items-center gap-3">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-medium">{teacher.name}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            {course.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{course.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{enrollmentCount} estudiantes</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{lessons.length} lecciones</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <span>{quizzes.length} evaluaciones</span>
            </div>
          </div>
        </div>

        {/* Thumbnail & enroll card */}
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>

          {user?.role === 'STUDENT' && (
            <Card>
              <CardContent className="p-4">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium text-primary">
                          {progress?.percent || 0}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${progress?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    {lessons.length > 0 && (
                      <Button asChild className="w-full">
                        <Link to={`/courses/${course.id}/lesson/${lessons[0].id}`}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continuar aprendiendo
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full"
                    size="lg"
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscribiendo...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Inscribirse al curso
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Course content tabs */}
      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons">
            Lecciones ({lessons.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            Evaluaciones ({quizzes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-2">
          {lessons.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No hay lecciones disponibles todavía
                </p>
              </CardContent>
            </Card>
          ) : (
            lessons.map((lesson, index) => {
              const isCompleted = progress?.completedLessonIds.includes(lesson.id);
              return (
                <Card
                  key={lesson.id}
                  className={cn(
                    'card-hover cursor-pointer',
                    !isEnrolled && 'opacity-75'
                  )}
                >
                  <CardContent className="p-4">
                    <Link
                      to={
                        isEnrolled
                          ? `/courses/${course.id}/lesson/${lesson.id}`
                          : '#'
                      }
                      className="flex items-center gap-4"
                      onClick={(e) => {
                        if (!isEnrolled) {
                          e.preventDefault();
                          toast({
                            title: 'Inscripción requerida',
                            description: 'Debes inscribirte al curso para ver las lecciones',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full font-medium',
                          isCompleted
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration}
                          </p>
                        )}
                      </div>
                      <PlayCircle className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-2">
          {quizzes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <ClipboardList className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No hay evaluaciones disponibles todavía
                </p>
              </CardContent>
            </Card>
          ) : (
            quizzes.map((quiz) => {
              const submission = dataStore.submissions.find(
                s => s.quizId === quiz.id && s.studentId === user?.id
              );
              return (
                <Card key={quiz.id} className="card-hover">
                  <CardContent className="p-4">
                    <Link
                      to={
                        isEnrolled ? `/courses/${course.id}/quiz/${quiz.id}` : '#'
                      }
                      className="flex items-center justify-between"
                      onClick={(e) => {
                        if (!isEnrolled) {
                          e.preventDefault();
                          toast({
                            title: 'Inscripción requerida',
                            description: 'Debes inscribirte al curso para tomar evaluaciones',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full',
                            submission
                              ? 'bg-success text-success-foreground'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {submission ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <ClipboardList className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          {quiz.description && (
                            <p className="text-sm text-muted-foreground">
                              {quiz.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {submission ? (
                          <div>
                            <p className="font-medium text-success">
                              {submission.score}/{submission.maxScore}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Completado
                            </p>
                          </div>
                        ) : (
                          quiz.timeLimit && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {quiz.timeLimit} min
                            </div>
                          )
                        )}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
