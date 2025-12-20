import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore, delay } from '@/lib/api';
import type { Course, Enrollment, Progress, Quiz, Notification } from '@/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  ClipboardList,
  Users,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      if (user?.role === 'STUDENT') {
        // Get enrolled courses
        const enrollments = dataStore.enrollments.filter(e => e.studentId === user.id);
        const courses = enrollments.map(e =>
          dataStore.courses.find(c => c.id === e.courseId)
        ).filter(Boolean) as Course[];
        setEnrolledCourses(courses);

        // Get progress
        const userProgress = dataStore.progress.filter(p => p.studentId === user.id);
        setProgress(userProgress);

        // Get upcoming quizzes
        const courseIds = courses.map(c => c.id);
        const quizzes = dataStore.quizzes.filter(q => courseIds.includes(q.courseId));
        setUpcomingQuizzes(quizzes.slice(0, 3));

        // Calculate stats
        const completed = userProgress.filter(p => p.percent === 100).length;
        const avgProgress = userProgress.length > 0
          ? Math.round(userProgress.reduce((sum, p) => sum + p.percent, 0) / userProgress.length)
          : 0;

        setStats({
          totalCourses: courses.length,
          completedCourses: completed,
          averageProgress: avgProgress,
          totalQuizzes: quizzes.length,
        });
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getProgressForCourse = (courseId: string) => {
    const p = progress.find(p => p.courseId === courseId);
    return p?.percent || 0;
  };

  // Different dashboard views based on role
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'TEACHER') {
    return <TeacherDashboard />;
  }

  // Student Dashboard
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continúa tu aprendizaje donde lo dejaste
          </p>
        </div>
        <Button asChild>
          <Link to="/courses">
            Explorar cursos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cursos Inscritos"
          value={stats.totalCourses}
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          title="Cursos Completados"
          value={stats.completedCourses}
          icon={Award}
          color="success"
        />
        <StatCard
          title="Progreso Promedio"
          value={`${stats.averageProgress}%`}
          icon={TrendingUp}
          color="info"
        />
        <StatCard
          title="Quizzes Pendientes"
          value={stats.totalQuizzes}
          icon={ClipboardList}
          color="warning"
        />
      </div>

      {/* Continue learning */}
      {enrolledCourses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Continuar aprendiendo</h2>
            <Button variant="ghost" asChild>
              <Link to="/my-courses">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolled
                progress={getProgressForCourse(course.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {enrolledCourses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No estás inscrito en ningún curso</h3>
            <p className="text-muted-foreground text-center mb-4">
              Explora nuestro catálogo y encuentra el curso perfecto para ti
            </p>
            <Button asChild>
              <Link to="/courses">Explorar cursos</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming quizzes */}
      {upcomingQuizzes.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold mb-4">Próximas evaluaciones</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingQuizzes.map((quiz) => {
              const course = dataStore.courses.find(c => c.id === quiz.courseId);
              return (
                <Card key={quiz.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{course?.title}</p>
                      </div>
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    {quiz.timeLimit && (
                      <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {quiz.timeLimit} minutos
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function AdminDashboard() {
  const totalUsers = dataStore.users.length;
  const totalCourses = dataStore.courses.length;
  const totalEnrollments = dataStore.enrollments.length;
  const activeStudents = dataStore.users.filter(u => u.role === 'STUDENT' && u.isActive).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Panel de Administración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Vista general de la plataforma EduNova
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Usuarios Totales" value={totalUsers} icon={Users} color="primary" />
        <StatCard title="Cursos Activos" value={totalCourses} icon={BookOpen} color="success" />
        <StatCard title="Inscripciones" value={totalEnrollments} icon={GraduationCap} color="info" />
        <StatCard title="Estudiantes Activos" value={activeStudents} icon={TrendingUp} color="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Administra usuarios, cambia roles y gestiona accesos.
            </p>
            <Button asChild>
              <Link to="/admin/users">Gestionar usuarios</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Gestión de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Revisa y administra todos los cursos de la plataforma.
            </p>
            <Button asChild>
              <Link to="/admin/courses">Ver cursos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const { user } = useAuth();
  const myCourses = dataStore.courses.filter(c => c.teacherId === user?.id);
  const totalStudents = new Set(
    dataStore.enrollments
      .filter(e => myCourses.some(c => c.id === e.courseId))
      .map(e => e.studentId)
  ).size;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Panel del Profesor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona tus cursos y estudiantes
          </p>
        </div>
        <Button asChild>
          <Link to="/teacher/courses">
            Gestionar mis cursos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Mis Cursos" value={myCourses.length} icon={BookOpen} color="primary" />
        <StatCard title="Estudiantes" value={totalStudents} icon={Users} color="success" />
        <StatCard
          title="Quizzes Creados"
          value={dataStore.quizzes.filter(q => myCourses.some(c => c.id === q.courseId)).length}
          icon={ClipboardList}
          color="info"
        />
        <StatCard
          title="Lecciones"
          value={dataStore.lessons.filter(l => myCourses.some(c => c.id === l.courseId)).length}
          icon={BarChart3}
          color="warning"
        />
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Mis Cursos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} showTeacher={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'info';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
          <div className={cn('rounded-full p-3', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
