import { useEffect, useState } from 'react';
import { dataStore, delay } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Course } from '@/types';
import { CourseCard } from '@/components/courses/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CoursesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);
      setCourses(dataStore.courses);
      setFilteredCourses(dataStore.courses);

      if (user) {
        const enrolled = dataStore.enrollments
          .filter(e => e.studentId === user.id)
          .map(e => e.courseId);
        setEnrolledCourseIds(enrolled);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  useEffect(() => {
    let result = courses;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(c => c.category === categoryFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      result = result.filter(c => c.level === levelFilter);
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, categoryFilter, levelFilter]);

  const categories = [...new Set(courses.map(c => c.category))];

  const getProgressForCourse = (courseId: string) => {
    const progress = dataStore.progress.find(
      p => p.studentId === user?.id && p.courseId === courseId
    );
    return progress?.percent || 0;
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
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Catálogo de Cursos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explora nuestra colección de cursos y comienza a aprender
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="Beginner">Principiante</SelectItem>
              <SelectItem value="Intermediate">Intermedio</SelectItem>
              <SelectItem value="Advanced">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando {filteredCourses.length} de {courses.length} cursos
      </p>

      {/* Courses grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolledCourseIds.includes(course.id)}
              progress={
                enrolledCourseIds.includes(course.id)
                  ? getProgressForCourse(course.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground text-center mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setLevelFilter('all');
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
