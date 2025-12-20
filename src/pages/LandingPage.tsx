import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">EduNova</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild><Link to="/login">Iniciar Sesión</Link></Button>
            <Button asChild><Link to="/register">Registrarse</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight">
            Transforma tu futuro con <span className="gradient-text">aprendizaje en línea</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Accede a cursos de calidad, aprende a tu ritmo y obtén las habilidades que el mercado demanda.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild><Link to="/register">Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/courses">Explorar cursos</Link></Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-12">¿Por qué EduNova?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Cursos de calidad', desc: 'Contenido actualizado y relevante para el mercado laboral actual.' },
              { icon: Users, title: 'Instructores expertos', desc: 'Aprende de profesionales con experiencia en la industria.' },
              { icon: Award, title: 'Certificaciones', desc: 'Obtén certificados que avalen tus nuevas habilidades.' },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-card border">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center text-muted-foreground">
          <p>© 2025 EduNova LMS. Demo de Learning Management System.</p>
        </div>
      </footer>
    </div>
  );
}
