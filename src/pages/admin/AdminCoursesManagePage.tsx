import { useEffect, useState } from 'react';
import { dataStore, delay } from '@/lib/api';
import { createCourse, updateCourse, deleteCourse } from '@/lib/courseApi';
import type { Course, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, Plus, Pencil, Trash2, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseFormModal } from '@/components/admin/CourseFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

export default function AdminCoursesManagePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [courseModal, setCourseModal] = useState<{ open: boolean; course: Course | null }>({ open: false, course: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; course: Course | null }>({ open: false, course: null });

  const loadData = async () => {
    await delay(300, 500);
    setCourses([...dataStore.courses]);
    setTeachers(dataStore.users.filter(u => u.role === 'TEACHER' || u.role === 'ADMIN'));
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateCourse = async (data: Omit<Course, 'id' | 'createdAt'>) => {
    const result = await createCourse(data);
    if (result.success) {
      setCourses([...dataStore.courses]);
      toast({ title: 'Curso creado', description: 'El curso ha sido creado exitosamente' });
    }
  };

  const handleUpdateCourse = async (data: Omit<Course, 'id' | 'createdAt'>) => {
    if (!courseModal.course) return;
    const result = await updateCourse(courseModal.course.id, data);
    if (result.success) {
      setCourses([...dataStore.courses]);
      toast({ title: 'Curso actualizado' });
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteModal.course) return;
    const result = await deleteCourse(deleteModal.course.id);
    if (result.success) {
      setCourses([...dataStore.courses]);
      toast({ title: 'Curso eliminado' });
    }
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Gestión de Cursos</h1>
          <p className="text-muted-foreground mt-1">Administra todos los cursos de la plataforma</p>
        </div>
        <Button onClick={() => setCourseModal({ open: true, course: null })}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Curso
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Cursos ({courses.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.map((course) => {
              const teacher = dataStore.users.find(u => u.id === course.teacherId);
              const enrollments = dataStore.enrollments.filter(e => e.courseId === course.id).length;
              const lessonsCount = dataStore.lessons.filter(l => l.courseId === course.id).length;
              const quizzesCount = dataStore.quizzes.filter(q => q.courseId === course.id).length;
              return (
                <div key={course.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <img src={course.thumbnail} alt={course.title} className="h-16 w-24 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-sm text-muted-foreground">Por: {teacher?.name || 'Desconocido'}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{lessonsCount} lecciones</span>
                      <span>{quizzesCount} evaluaciones</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{course.category}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{enrollments}</div>
                  <div className="flex items-center gap-1">
                    <Link to={`/admin/courses/${course.id}/manage`}>
                      <Button variant="outline" size="sm"><Settings className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setCourseModal({ open: true, course })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteModal({ open: true, course })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {courses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No hay cursos creados</div>
            )}
          </div>
        </CardContent>
      </Card>

      <CourseFormModal
        open={courseModal.open}
        onOpenChange={(open) => setCourseModal({ ...courseModal, open })}
        course={courseModal.course}
        teachers={teachers}
        onSubmit={courseModal.course ? handleUpdateCourse : handleCreateCourse}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Eliminar Curso"
        description={`¿Estás seguro de eliminar "${deleteModal.course?.title}"? Se eliminarán también todas las lecciones, evaluaciones e inscripciones.`}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
}
