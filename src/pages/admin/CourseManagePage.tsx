import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataStore, delay } from '@/lib/api';
import { 
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz,
  createQuestion, deleteQuestion,
  getEnrolledStudents, removeEnrollment
} from '@/lib/courseApi';
import type { Course, Lesson, Quiz, Question, Option, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, ClipboardList, Users, Plus, Pencil, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import { LessonFormModal } from '@/components/admin/LessonFormModal';
import { QuizFormModal } from '@/components/admin/QuizFormModal';
import { QuestionFormModal } from '@/components/admin/QuestionFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseManagePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [students, setStudents] = useState<(User & { enrolledAt: string })[]>([]);
  
  const [lessonModal, setLessonModal] = useState<{ open: boolean; lesson: Lesson | null }>({ open: false, lesson: null });
  const [quizModal, setQuizModal] = useState<{ open: boolean; quiz: Quiz | null }>({ open: false, quiz: null });
  const [questionModal, setQuestionModal] = useState<{ open: boolean; question: Question | null; quizId: string }>({ open: false, question: null, quizId: '' });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: string; item: any }>({ open: false, type: '', item: null });

  const isAdmin = user?.role === 'ADMIN';
  const backUrl = isAdmin ? '/admin/courses/manage' : '/teacher/courses';

  const loadData = async () => {
    await delay(300, 500);
    const foundCourse = dataStore.courses.find(c => c.id === id);
    if (!foundCourse) {
      setIsLoading(false);
      return;
    }
    setCourse(foundCourse);
    setLessons(dataStore.lessons.filter(l => l.courseId === id).sort((a, b) => a.orderNumber - b.orderNumber));
    setQuizzes(dataStore.quizzes.filter(q => q.courseId === id));
    setQuestions(dataStore.questions);
    setOptions(dataStore.options);
    setStudents(getEnrolledStudents(id!));
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  // Lesson handlers
  const handleSaveLesson = async (data: Omit<Lesson, 'id'>) => {
    if (lessonModal.lesson) {
      const result = await updateLesson(lessonModal.lesson.id, data);
      if (result.success) {
        toast({ title: 'Lección actualizada' });
        loadData();
      }
    } else {
      const result = await createLesson(data);
      if (result.success) {
        toast({ title: 'Lección creada' });
        loadData();
      }
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteModal.item) return;
    await deleteLesson(deleteModal.item.id);
    toast({ title: 'Lección eliminada' });
    loadData();
  };

  // Quiz handlers
  const handleSaveQuiz = async (data: Omit<Quiz, 'id' | 'createdAt'>) => {
    if (quizModal.quiz) {
      const result = await updateQuiz(quizModal.quiz.id, data);
      if (result.success) {
        toast({ title: 'Evaluación actualizada' });
        loadData();
      }
    } else {
      const result = await createQuiz(data);
      if (result.success) {
        toast({ title: 'Evaluación creada' });
        loadData();
      }
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteModal.item) return;
    await deleteQuiz(deleteModal.item.id);
    toast({ title: 'Evaluación eliminada' });
    loadData();
  };

  // Question handlers
  const handleSaveQuestion = async (data: Omit<Question, 'id'>, opts: { text: string; isCorrect: boolean }[]) => {
    if (questionModal.question) {
      // For simplicity, delete old and create new
      await deleteQuestion(questionModal.question.id);
    }
    await createQuestion(data, opts);
    toast({ title: questionModal.question ? 'Pregunta actualizada' : 'Pregunta creada' });
    loadData();
  };

  const handleDeleteQuestion = async () => {
    if (!deleteModal.item) return;
    await deleteQuestion(deleteModal.item.id);
    toast({ title: 'Pregunta eliminada' });
    loadData();
  };

  // Student removal
  const handleRemoveStudent = async () => {
    if (!deleteModal.item) return;
    await removeEnrollment(deleteModal.item.id, id!);
    toast({ title: 'Estudiante removido del curso' });
    loadData();
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!course) {
    return <div className="text-center py-12 text-muted-foreground">Curso no encontrado</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to={backUrl}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Gestionar contenido del curso</p>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons" className="gap-2"><BookOpen className="h-4 w-4" />Lecciones</TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2"><ClipboardList className="h-4 w-4" />Evaluaciones</TabsTrigger>
          <TabsTrigger value="students" className="gap-2"><Users className="h-4 w-4" />Estudiantes</TabsTrigger>
        </TabsList>

        {/* LESSONS TAB */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lecciones ({lessons.length})</CardTitle>
              <Button size="sm" onClick={() => setLessonModal({ open: true, lesson: null })}>
                <Plus className="h-4 w-4 mr-1" /> Nueva Lección
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="w-8 justify-center">{lesson.orderNumber}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">{lesson.duration || 'Sin duración'}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setLessonModal({ open: true, lesson })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, type: 'lesson', item: lesson })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No hay lecciones. ¡Crea la primera!</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QUIZZES TAB */}
        <TabsContent value="quizzes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evaluaciones ({quizzes.length})</CardTitle>
              <Button size="sm" onClick={() => setQuizModal({ open: true, quiz: null })}>
                <Plus className="h-4 w-4 mr-1" /> Nueva Evaluación
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const quizQuestions = questions.filter(q => q.quizId === quiz.id);
                  return (
                    <div key={quiz.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground">{quizQuestions.length} preguntas • {quiz.timeLimit} min</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => setQuizModal({ open: true, quiz })}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeleteModal({ open: true, type: 'quiz', item: quiz })}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pl-4 border-l-2 space-y-2">
                        {quizQuestions.map((q, idx) => (
                          <div key={q.id} className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">{idx + 1}.</span>
                            <span className="flex-1 truncate">{q.text}</span>
                            <Button variant="ghost" size="sm" onClick={() => setQuestionModal({ open: true, question: q, quizId: quiz.id })}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, type: 'question', item: q })}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="text-primary" onClick={() => setQuestionModal({ open: true, question: null, quizId: quiz.id })}>
                          <Plus className="h-4 w-4 mr-1" /> Agregar pregunta
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {quizzes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No hay evaluaciones. ¡Crea la primera!</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Estudiantes Inscritos ({students.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => {
                  const progress = dataStore.progress.find(p => p.studentId === student.id && p.courseId === id);
                  return (
                    <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">{progress?.percent || 0}% completado</p>
                        <p className="text-xs text-muted-foreground">Inscrito: {new Date(student.enrolledAt).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, type: 'student', item: student })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
                {students.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No hay estudiantes inscritos</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <LessonFormModal
        open={lessonModal.open}
        onOpenChange={(open) => setLessonModal({ ...lessonModal, open })}
        lesson={lessonModal.lesson}
        courseId={id!}
        nextOrderNumber={lessons.length + 1}
        onSubmit={handleSaveLesson}
      />

      <QuizFormModal
        open={quizModal.open}
        onOpenChange={(open) => setQuizModal({ ...quizModal, open })}
        quiz={quizModal.quiz}
        courseId={id!}
        onSubmit={handleSaveQuiz}
      />

      <QuestionFormModal
        open={questionModal.open}
        onOpenChange={(open) => setQuestionModal({ ...questionModal, open })}
        question={questionModal.question}
        existingOptions={questionModal.question ? options.filter(o => o.questionId === questionModal.question!.id) : undefined}
        quizId={questionModal.quizId}
        onSubmit={handleSaveQuestion}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title={deleteModal.type === 'lesson' ? 'Eliminar Lección' : deleteModal.type === 'quiz' ? 'Eliminar Evaluación' : deleteModal.type === 'question' ? 'Eliminar Pregunta' : 'Remover Estudiante'}
        description={deleteModal.type === 'student' 
          ? `¿Remover a "${deleteModal.item?.name}" del curso?` 
          : `¿Estás seguro de eliminar "${deleteModal.item?.title || deleteModal.item?.text}"?`}
        onConfirm={
          deleteModal.type === 'lesson' ? handleDeleteLesson :
          deleteModal.type === 'quiz' ? handleDeleteQuiz :
          deleteModal.type === 'question' ? handleDeleteQuestion :
          handleRemoveStudent
        }
      />
    </div>
  );
}
