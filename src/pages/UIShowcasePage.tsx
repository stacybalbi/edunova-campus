import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  BookOpen, Users, GraduationCap, Settings, Bell, Search,
  Plus, Edit, Trash2, Eye, ChevronDown, AlertCircle, CheckCircle,
  Info, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const UIShowcasePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-2xl font-bold text-primary">EduNova UI Showcase</h1>
          </div>
          <Badge variant="secondary">Documentación de Componentes</Badge>
        </div>
      </header>

      <div className="container py-8">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-12 pr-4">
            
            {/* ===== SECCIÓN 1: PÁGINAS Y FORMULARIOS ===== */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-primary">1. Descripción de Páginas y Formularios</h2>
              
              <Accordion type="multiple" className="space-y-4">
                {/* Login Page */}
                <AccordionItem value="login" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Página de Login (/login)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Formulario de autenticación que permite a los usuarios iniciar sesión en la plataforma.
                        Valida credenciales contra la base de datos simulada y establece la sesión del usuario.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Input (Email)</Badge>
                        <Badge>Input (Password)</Badge>
                        <Badge>Button (Submit)</Badge>
                        <Badge>Link (Registro)</Badge>
                        <Badge>Card Container</Badge>
                        <Badge>Label</Badge>
                        <Badge>Toast (Notificaciones)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Register Page */}
                <AccordionItem value="register" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Página de Registro (/register)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Formulario de registro para nuevos estudiantes. Captura nombre, email y contraseña.
                        Por defecto crea usuarios con rol STUDENT.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Input (Nombre)</Badge>
                        <Badge>Input (Email)</Badge>
                        <Badge>Input (Password)</Badge>
                        <Badge>Input (Confirmar Password)</Badge>
                        <Badge>Button (Registrarse)</Badge>
                        <Badge>Link (Login)</Badge>
                        <Badge>Card Container</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Dashboard */}
                <AccordionItem value="dashboard" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Dashboard (/dashboard)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Panel principal personalizado según el rol del usuario. Muestra resumen de cursos,
                        progreso, notificaciones y accesos rápidos. Diferentes vistas para ADMIN, TEACHER y STUDENT.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Card (Stats)</Badge>
                        <Badge>Progress Bar</Badge>
                        <Badge>Avatar</Badge>
                        <Badge>Badge</Badge>
                        <Badge>Button (Acciones)</Badge>
                        <Badge>Table (Cursos)</Badge>
                        <Badge>Alert (Notificaciones)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Courses Page */}
                <AccordionItem value="courses" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Catálogo de Cursos (/courses)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Listado de todos los cursos disponibles con opciones de búsqueda y filtrado.
                        Permite ver detalles e inscribirse en cursos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Input (Búsqueda)</Badge>
                        <Badge>Select (Categoría)</Badge>
                        <Badge>Card Grid</Badge>
                        <Badge>CourseCard Component</Badge>
                        <Badge>Button (Ver curso)</Badge>
                        <Badge>Badge (Categoría)</Badge>
                        <Badge>Skeleton (Loading)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Course Detail */}
                <AccordionItem value="course-detail" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Detalle de Curso (/courses/:id)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Vista detallada de un curso con información completa, lista de lecciones,
                        evaluaciones disponibles y opción de inscripción.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Tabs (Lecciones/Evaluaciones)</Badge>
                        <Badge>Card (Info curso)</Badge>
                        <Badge>Button (Inscribirse)</Badge>
                        <Badge>Badge (Estado)</Badge>
                        <Badge>Accordion (Lecciones)</Badge>
                        <Badge>Progress (Avance)</Badge>
                        <Badge>Avatar (Profesor)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Lesson Page */}
                <AccordionItem value="lesson" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Vista de Lección (/lesson/:id)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Página de visualización de contenido de lección con navegación entre lecciones
                        y opción de marcar como completada.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Card (Contenido)</Badge>
                        <Badge>Button (Completar)</Badge>
                        <Badge>Button (Anterior/Siguiente)</Badge>
                        <Badge>Breadcrumb</Badge>
                        <Badge>Badge (Estado)</Badge>
                        <Badge>Checkbox (Completado)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Quiz Page */}
                <AccordionItem value="quiz" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Evaluación/Quiz (/quiz/:id)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Interfaz para realizar evaluaciones con preguntas de opción múltiple.
                        Calcula automáticamente la puntuación y guarda el resultado.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>RadioGroup (Opciones)</Badge>
                        <Badge>Card (Pregunta)</Badge>
                        <Badge>Button (Enviar)</Badge>
                        <Badge>Progress (Avance)</Badge>
                        <Badge>Alert (Resultado)</Badge>
                        <Badge>Badge (Puntuación)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* My Courses */}
                <AccordionItem value="my-courses" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Mis Cursos (/my-courses)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Lista de cursos en los que el estudiante está inscrito con su progreso actual.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Card Grid</Badge>
                        <Badge>CourseCard</Badge>
                        <Badge>Progress Bar</Badge>
                        <Badge>Button (Continuar)</Badge>
                        <Badge>Empty State</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Progress Page */}
                <AccordionItem value="progress" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Mi Progreso (/progress)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Vista detallada del progreso del estudiante en todos sus cursos,
                        incluyendo lecciones completadas y porcentajes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Table</Badge>
                        <Badge>Progress Bar</Badge>
                        <Badge>Badge (Porcentaje)</Badge>
                        <Badge>Card (Resumen)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Grades Page */}
                <AccordionItem value="grades" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Mis Calificaciones (/grades)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Historial de todas las evaluaciones realizadas con puntuaciones y fechas.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Table</Badge>
                        <Badge>Badge (Calificación)</Badge>
                        <Badge>Card (Stats)</Badge>
                        <Badge>Empty State</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Admin Users */}
                <AccordionItem value="admin-users" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Gestión de Usuarios (/admin/users)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Panel administrativo para gestionar usuarios: crear, editar roles,
                        activar/desactivar y eliminar usuarios.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Table (Usuarios)</Badge>
                        <Badge>Button (Crear)</Badge>
                        <Badge>Dialog (Modal Formulario)</Badge>
                        <Badge>Select (Rol)</Badge>
                        <Badge>Switch (Activo)</Badge>
                        <Badge>DropdownMenu (Acciones)</Badge>
                        <Badge>AlertDialog (Confirmar)</Badge>
                        <Badge>Input (Búsqueda)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Admin Courses */}
                <AccordionItem value="admin-courses" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Gestión de Cursos (/admin/courses/manage)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Panel para administrar todos los cursos: crear, editar, eliminar cursos
                        y acceder a la gestión de contenido de cada uno.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Table (Cursos)</Badge>
                        <Badge>Button (Nuevo Curso)</Badge>
                        <Badge>Dialog (Modal Curso)</Badge>
                        <Badge>Input (Título)</Badge>
                        <Badge>Textarea (Descripción)</Badge>
                        <Badge>Select (Categoría/Profesor)</Badge>
                        <Badge>DropdownMenu (Acciones)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Course Manage */}
                <AccordionItem value="course-manage" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    📄 Gestión de Contenido (/admin/courses/:id/manage)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Descripción:</h4>
                      <p className="text-muted-foreground">
                        Gestión completa del contenido de un curso: lecciones, evaluaciones,
                        preguntas y estudiantes inscritos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Controles utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Tabs (Lecciones/Quizzes/Estudiantes)</Badge>
                        <Badge>Table</Badge>
                        <Badge>Dialog (Modales CRUD)</Badge>
                        <Badge>Input/Textarea</Badge>
                        <Badge>Accordion (Preguntas)</Badge>
                        <Badge>Button (Acciones)</Badge>
                        <Badge>AlertDialog (Confirmar)</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <Separator className="my-8" />

            {/* ===== SECCIÓN 2: COMPONENTES UI ===== */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-primary">2. Catálogo de Componentes UI</h2>
              
              <div className="grid gap-8">
                {/* Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🔘</span> Buttons
                    </CardTitle>
                    <CardDescription>
                      Componente de botón con múltiples variantes para diferentes acciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button disabled>Disabled</Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Con Icono
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📝</span> Inputs & Forms
                    </CardTitle>
                    <CardDescription>
                      Campos de entrada para formularios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="text">Input de Texto</Label>
                        <Input 
                          id="text" 
                          placeholder="Escribe aquí..." 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Input de Email</Label>
                        <Input id="email" type="email" placeholder="email@ejemplo.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Input de Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="search">Input con Icono</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="search" placeholder="Buscar..." className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea id="textarea" placeholder="Descripción larga..." />
                    </div>
                  </CardContent>
                </Card>

                {/* Select */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📋</span> Select
                    </CardTitle>
                    <CardDescription>
                      Menú desplegable para selección de opciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Seleccionar Categoría</Label>
                        <Select value={selectValue} onValueChange={setSelectValue}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="programming">Programación</SelectItem>
                            <SelectItem value="design">Diseño</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="business">Negocios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Seleccionar Rol</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="teacher">Profesor</SelectItem>
                            <SelectItem value="student">Estudiante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Checkbox & Switch */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">☑️</span> Checkbox & Switch
                    </CardTitle>
                    <CardDescription>
                      Controles para opciones booleanas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={checkboxValue}
                        onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
                      />
                      <Label htmlFor="terms">Acepto los términos y condiciones</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="notifications" 
                        checked={switchValue}
                        onCheckedChange={setSwitchValue}
                      />
                      <Label htmlFor="notifications">Activar notificaciones</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🃏</span> Cards
                    </CardTitle>
                    <CardDescription>
                      Contenedores para agrupar información relacionada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Cursos Activos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">12</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Estudiantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">248</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Evaluaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">56</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🏷️</span> Badges
                    </CardTitle>
                    <CardDescription>
                      Etiquetas para mostrar estados o categorías.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Avatars */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">👤</span> Avatars
                    </CardTitle>
                    <CardDescription>
                      Representación visual de usuarios.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">MG</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📊</span> Progress
                    </CardTitle>
                    <CardDescription>
                      Barra de progreso para indicar avance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso del curso</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lecciones completadas</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} />
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📑</span> Tabs
                    </CardTitle>
                    <CardDescription>
                      Navegación por pestañas para organizar contenido.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="lessons">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                        <TabsTrigger value="quizzes">Evaluaciones</TabsTrigger>
                        <TabsTrigger value="students">Estudiantes</TabsTrigger>
                      </TabsList>
                      <TabsContent value="lessons" className="p-4 border rounded-lg mt-2">
                        Contenido de lecciones...
                      </TabsContent>
                      <TabsContent value="quizzes" className="p-4 border rounded-lg mt-2">
                        Contenido de evaluaciones...
                      </TabsContent>
                      <TabsContent value="students" className="p-4 border rounded-lg mt-2">
                        Lista de estudiantes...
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📋</span> Table
                    </CardTitle>
                    <CardDescription>
                      Tabla para mostrar datos estructurados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Juan Pérez</TableCell>
                          <TableCell>juan@email.com</TableCell>
                          <TableCell><Badge>Admin</Badge></TableCell>
                          <TableCell><Badge variant="secondary">Activo</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">María García</TableCell>
                          <TableCell>maria@email.com</TableCell>
                          <TableCell><Badge variant="outline">Teacher</Badge></TableCell>
                          <TableCell><Badge variant="secondary">Activo</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Dialog/Modal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">💬</span> Dialog / Modal
                    </CardTitle>
                    <CardDescription>
                      Ventana modal para formularios y confirmaciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Abrir Modal</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crear Nuevo Curso</DialogTitle>
                          <DialogDescription>
                            Complete los campos para crear un nuevo curso.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Título del curso</Label>
                            <Input placeholder="Ej: Introducción a React" />
                          </div>
                          <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea placeholder="Descripción del curso..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button>Guardar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Dropdown Menu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📜</span> Dropdown Menu
                    </CardTitle>
                    <CardDescription>
                      Menú desplegable para acciones contextuales.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Acciones <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">⚠️</span> Alerts
                    </CardTitle>
                    <CardDescription>
                      Mensajes de alerta para notificaciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Información</AlertTitle>
                      <AlertDescription>
                        Este es un mensaje informativo para el usuario.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Ha ocurrido un error al procesar su solicitud.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Toast */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🔔</span> Toast / Notificaciones
                    </CardTitle>
                    <CardDescription>
                      Notificaciones emergentes para feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={() => toast.success("¡Operación exitosa!")}>
                      Toast Éxito
                    </Button>
                    <Button variant="destructive" onClick={() => toast.error("Error al guardar")}>
                      Toast Error
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Información importante")}>
                      Toast Info
                    </Button>
                  </CardContent>
                </Card>

                {/* Skeleton */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">⏳</span> Skeleton / Loading
                    </CardTitle>
                    <CardDescription>
                      Placeholder durante la carga de contenido.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Icons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🎨</span> Iconos (Lucide)
                    </CardTitle>
                    <CardDescription>
                      Biblioteca de iconos utilizados en la aplicación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-xs">BookOpen</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Users className="h-6 w-6" />
                        <span className="text-xs">Users</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <GraduationCap className="h-6 w-6" />
                        <span className="text-xs">GraduationCap</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Settings className="h-6 w-6" />
                        <span className="text-xs">Settings</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Bell className="h-6 w-6" />
                        <span className="text-xs">Bell</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Plus className="h-6 w-6" />
                        <span className="text-xs">Plus</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Edit className="h-6 w-6" />
                        <span className="text-xs">Edit</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <Trash2 className="h-6 w-6" />
                        <span className="text-xs">Trash2</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 border rounded">
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-xs">CheckCircle</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UIShowcasePage;
