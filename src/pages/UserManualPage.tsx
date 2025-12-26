import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UserManualPage = () => {
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
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Manual de Usuario</h1>
            </div>
          </div>
          <Badge variant="secondary">EduNova LMS v1.0</Badge>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar / Table of Contents */}
          <aside className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Índice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#intro" className="block text-sm text-muted-foreground hover:text-primary">1. Introducción</a>
                <a href="#login" className="block text-sm text-muted-foreground hover:text-primary">2. Acceso al Sistema</a>
                <a href="#dashboard" className="block text-sm text-muted-foreground hover:text-primary">3. Dashboard</a>
                <a href="#courses" className="block text-sm text-muted-foreground hover:text-primary">4. Cursos</a>
                <a href="#lessons" className="block text-sm text-muted-foreground hover:text-primary">5. Lecciones</a>
                <a href="#quizzes" className="block text-sm text-muted-foreground hover:text-primary">6. Evaluaciones</a>
                <a href="#progress" className="block text-sm text-muted-foreground hover:text-primary">7. Progreso y Calificaciones</a>
                <a href="#admin" className="block text-sm text-muted-foreground hover:text-primary">8. Panel de Administración</a>
                <a href="#teacher" className="block text-sm text-muted-foreground hover:text-primary">9. Panel del Profesor</a>
                <a href="#faq" className="block text-sm text-muted-foreground hover:text-primary">10. FAQ</a>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-8 pr-4">
              
              {/* Introducción */}
              <section id="intro">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">1. Introducción</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      <strong>EduNova LMS</strong> es una plataforma de gestión del aprendizaje diseñada para 
                      instituciones educativas y empresas. Permite gestionar cursos, lecciones, evaluaciones 
                      y seguimiento del progreso de los estudiantes.
                    </p>
                    
                    <h4>Roles del Sistema</h4>
                    <ul>
                      <li><strong>Administrador (ADMIN):</strong> Acceso completo al sistema. Puede gestionar usuarios, cursos y todo el contenido.</li>
                      <li><strong>Profesor (TEACHER):</strong> Puede crear y gestionar sus propios cursos, lecciones y evaluaciones.</li>
                      <li><strong>Estudiante (STUDENT):</strong> Puede inscribirse en cursos, ver lecciones, realizar evaluaciones y consultar su progreso.</li>
                    </ul>

                    <h4>Cuentas de Prueba</h4>
                    <div className="bg-muted p-4 rounded-lg not-prose">
                      <div className="grid gap-2 text-sm">
                        <div><Badge>ADMIN</Badge> admin@edunova.com / admin123</div>
                        <div><Badge variant="outline">TEACHER</Badge> maria.garcia@edunova.com / teacher123</div>
                        <div><Badge variant="secondary">STUDENT</Badge> ana.martinez@student.com / student123</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Acceso al Sistema */}
              <section id="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">2. Acceso al Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>2.1 Iniciar Sesión</h4>
                    <ol>
                      <li>Acceda a la página principal de EduNova LMS</li>
                      <li>Haga clic en <strong>"Iniciar Sesión"</strong></li>
                      <li>Ingrese su correo electrónico y contraseña</li>
                      <li>Haga clic en <strong>"Entrar"</strong></li>
                    </ol>

                    <h4>2.2 Registro de Nuevos Usuarios</h4>
                    <ol>
                      <li>En la página de login, haga clic en <strong>"Crear cuenta"</strong></li>
                      <li>Complete los campos: nombre, email y contraseña</li>
                      <li>Haga clic en <strong>"Registrarse"</strong></li>
                      <li>Por defecto, las nuevas cuentas se crean como STUDENT</li>
                    </ol>

                    <h4>2.3 Cerrar Sesión</h4>
                    <p>
                      Para cerrar sesión, haga clic en el menú de usuario en la esquina superior derecha 
                      y seleccione <strong>"Cerrar sesión"</strong>.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Dashboard */}
              <section id="dashboard">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">3. Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      El Dashboard es la página principal después de iniciar sesión. Muestra un resumen 
                      personalizado según su rol.
                    </p>

                    <h4>3.1 Dashboard del Estudiante</h4>
                    <ul>
                      <li>Cursos inscritos y su progreso</li>
                      <li>Próximas evaluaciones pendientes</li>
                      <li>Notificaciones recientes</li>
                      <li>Accesos rápidos a continuar aprendiendo</li>
                    </ul>

                    <h4>3.2 Dashboard del Profesor</h4>
                    <ul>
                      <li>Cursos que imparte</li>
                      <li>Número de estudiantes inscritos</li>
                      <li>Evaluaciones pendientes de revisar</li>
                    </ul>

                    <h4>3.3 Dashboard del Administrador</h4>
                    <ul>
                      <li>Estadísticas generales del sistema</li>
                      <li>Total de usuarios, cursos y evaluaciones</li>
                      <li>Accesos rápidos a gestión</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Cursos */}
              <section id="courses">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">4. Cursos</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>4.1 Ver Catálogo de Cursos</h4>
                    <ol>
                      <li>En el menú lateral, haga clic en <strong>"Cursos"</strong></li>
                      <li>Use la barra de búsqueda para filtrar por título</li>
                      <li>Use el selector de categoría para filtrar por tema</li>
                    </ol>

                    <h4>4.2 Ver Detalle de un Curso</h4>
                    <ol>
                      <li>En el catálogo, haga clic en <strong>"Ver curso"</strong></li>
                      <li>Vea la descripción, lecciones disponibles y evaluaciones</li>
                      <li>Consulte información del profesor asignado</li>
                    </ol>

                    <h4>4.3 Inscribirse en un Curso (Estudiantes)</h4>
                    <ol>
                      <li>Acceda al detalle del curso deseado</li>
                      <li>Haga clic en el botón <strong>"Inscribirme"</strong></li>
                      <li>El curso aparecerá en su sección "Mis Cursos"</li>
                    </ol>

                    <h4>4.4 Mis Cursos</h4>
                    <p>
                      En el menú lateral, seleccione <strong>"Mis Cursos"</strong> para ver todos los 
                      cursos en los que está inscrito con su progreso actual.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Lecciones */}
              <section id="lessons">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">5. Lecciones</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>5.1 Acceder a una Lección</h4>
                    <ol>
                      <li>Desde el detalle del curso, vaya a la pestaña <strong>"Lecciones"</strong></li>
                      <li>Haga clic en la lección que desea estudiar</li>
                      <li>El contenido se mostrará en la página de lección</li>
                    </ol>

                    <h4>5.2 Marcar Lección como Completada</h4>
                    <ol>
                      <li>Al terminar de estudiar, haga clic en <strong>"Marcar como completada"</strong></li>
                      <li>Su progreso se actualizará automáticamente</li>
                      <li>Use los botones de navegación para ir a la siguiente lección</li>
                    </ol>

                    <h4>5.3 Navegación entre Lecciones</h4>
                    <p>
                      Use los botones <strong>"Anterior"</strong> y <strong>"Siguiente"</strong> para 
                      navegar entre lecciones del mismo curso.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Evaluaciones */}
              <section id="quizzes">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">6. Evaluaciones (Quizzes)</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>6.1 Ver Evaluaciones Disponibles</h4>
                    <ol>
                      <li>Desde el detalle del curso, vaya a la pestaña <strong>"Evaluaciones"</strong></li>
                      <li>Verá la lista de quizzes disponibles</li>
                      <li>Haga clic en <strong>"Tomar Quiz"</strong> para comenzar</li>
                    </ol>

                    <h4>6.2 Realizar una Evaluación</h4>
                    <ol>
                      <li>Lea cada pregunta cuidadosamente</li>
                      <li>Seleccione la respuesta que considere correcta</li>
                      <li>Puede ver su progreso en la barra superior</li>
                      <li>Al terminar, haga clic en <strong>"Enviar Respuestas"</strong></li>
                    </ol>

                    <h4>6.3 Ver Resultados</h4>
                    <p>
                      Después de enviar, verá inmediatamente su puntuación. Los resultados se guardan 
                      y puede consultarlos en la sección <strong>"Calificaciones"</strong>.
                    </p>

                    <div className="bg-muted p-4 rounded-lg not-prose">
                      <p className="text-sm"><strong>Nota:</strong> Las evaluaciones se califican automáticamente. 
                      Cada respuesta correcta suma puntos según el total de preguntas.</p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Progreso y Calificaciones */}
              <section id="progress">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">7. Progreso y Calificaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>7.1 Ver Mi Progreso</h4>
                    <ol>
                      <li>En el menú lateral, seleccione <strong>"Progreso"</strong></li>
                      <li>Vea el porcentaje de avance en cada curso</li>
                      <li>Consulte las lecciones completadas</li>
                    </ol>

                    <h4>7.2 Ver Mis Calificaciones</h4>
                    <ol>
                      <li>En el menú lateral, seleccione <strong>"Calificaciones"</strong></li>
                      <li>Vea el historial de todas sus evaluaciones</li>
                      <li>Consulte puntuaciones y fechas de realización</li>
                    </ol>

                    <h4>7.3 Interpretación de Calificaciones</h4>
                    <div className="not-prose">
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-green-500">90-100%: Excelente</Badge>
                        <Badge className="bg-blue-500">70-89%: Bueno</Badge>
                        <Badge className="bg-yellow-500">50-69%: Regular</Badge>
                        <Badge variant="destructive">0-49%: Necesita mejorar</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Panel de Administración */}
              <section id="admin">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">8. Panel de Administración</CardTitle>
                    <Badge>Solo ADMIN</Badge>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>8.1 Gestión de Usuarios</h4>
                    <p>Acceda desde <strong>Admin → Usuarios</strong></p>
                    <ul>
                      <li><strong>Crear usuario:</strong> Clic en "Nuevo Usuario", complete el formulario</li>
                      <li><strong>Cambiar rol:</strong> Use el selector de rol en la tabla</li>
                      <li><strong>Activar/Desactivar:</strong> Use el switch de estado</li>
                      <li><strong>Eliminar:</strong> Clic en el botón de eliminar y confirme</li>
                    </ul>

                    <h4>8.2 Gestión de Cursos</h4>
                    <p>Acceda desde <strong>Admin → Gestión de Cursos</strong></p>
                    <ul>
                      <li><strong>Crear curso:</strong> Clic en "Nuevo Curso"</li>
                      <li><strong>Editar curso:</strong> Clic en el ícono de editar</li>
                      <li><strong>Gestionar contenido:</strong> Clic en "Gestionar" para acceder a lecciones y evaluaciones</li>
                      <li><strong>Eliminar curso:</strong> Clic en eliminar y confirme</li>
                    </ul>

                    <h4>8.3 Gestión de Contenido de Curso</h4>
                    <p>Desde la vista de gestión de un curso específico:</p>
                    
                    <Accordion type="single" collapsible className="not-prose">
                      <AccordionItem value="lessons">
                        <AccordionTrigger>Gestión de Lecciones</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            <li>Crear nueva lección con título, contenido y orden</li>
                            <li>Editar lecciones existentes</li>
                            <li>Reordenar lecciones cambiando el número de orden</li>
                            <li>Eliminar lecciones (requiere confirmación)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="quizzes">
                        <AccordionTrigger>Gestión de Evaluaciones</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            <li>Crear nuevos quizzes</li>
                            <li>Agregar preguntas con opciones de respuesta</li>
                            <li>Marcar la opción correcta para cada pregunta</li>
                            <li>Editar y eliminar preguntas</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="students">
                        <AccordionTrigger>Gestión de Estudiantes</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            <li>Ver estudiantes inscritos en el curso</li>
                            <li>Consultar progreso de cada estudiante</li>
                            <li>Remover estudiantes del curso</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* Panel del Profesor */}
              <section id="teacher">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">9. Panel del Profesor</CardTitle>
                    <Badge variant="outline">Solo TEACHER</Badge>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <h4>9.1 Mis Cursos (Profesor)</h4>
                    <p>Acceda desde <strong>Profesor → Mis Cursos</strong></p>
                    <ul>
                      <li>Vea todos los cursos que tiene asignados</li>
                      <li>Consulte el número de estudiantes inscritos</li>
                      <li>Acceda a gestionar el contenido de cada curso</li>
                    </ul>

                    <h4>9.2 Gestionar Contenido</h4>
                    <p>
                      Los profesores tienen acceso a las mismas funcionalidades de gestión de contenido 
                      que los administradores, pero solo para sus propios cursos:
                    </p>
                    <ul>
                      <li>Agregar y editar lecciones</li>
                      <li>Crear evaluaciones y preguntas</li>
                      <li>Ver estudiantes inscritos</li>
                    </ul>

                    <div className="bg-muted p-4 rounded-lg not-prose">
                      <p className="text-sm"><strong>Nota:</strong> Los profesores no pueden crear nuevos cursos. 
                      Deben solicitar al administrador la creación y asignación de cursos.</p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* FAQ */}
              <section id="faq">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">10. Preguntas Frecuentes (FAQ)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="faq1">
                        <AccordionTrigger>¿Cómo recupero mi contraseña?</AccordionTrigger>
                        <AccordionContent>
                          En esta versión demo, contacte al administrador para restablecer su contraseña.
                          En la versión de producción se implementará recuperación por email.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq2">
                        <AccordionTrigger>¿Puedo inscribirme en varios cursos?</AccordionTrigger>
                        <AccordionContent>
                          Sí, puede inscribirse en tantos cursos como desee. Todos aparecerán en su 
                          sección "Mis Cursos" con su progreso individual.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq3">
                        <AccordionTrigger>¿Las evaluaciones tienen límite de tiempo?</AccordionTrigger>
                        <AccordionContent>
                          En la versión actual no hay límite de tiempo. Puede tomar el tiempo que 
                          necesite para completar cada evaluación.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq4">
                        <AccordionTrigger>¿Puedo repetir una evaluación?</AccordionTrigger>
                        <AccordionContent>
                          Sí, puede tomar una evaluación múltiples veces. Cada intento se registra 
                          en su historial de calificaciones.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq5">
                        <AccordionTrigger>¿Cómo contacto al soporte?</AccordionTrigger>
                        <AccordionContent>
                          Para esta versión demo, contacte al administrador del sistema. En producción,
                          habrá un sistema de tickets de soporte integrado.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* Footer */}
              <div className="text-center py-8 text-muted-foreground">
                <p>EduNova LMS v1.0 - Manual de Usuario</p>
                <p className="text-sm">© 2025 EduNova Solutions, SRL</p>
              </div>

            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UserManualPage;
