import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart, Shield, Users, Clock, Star, ArrowRight, CheckCircle } from "lucide-react";

const educationalContent = [
  {
    id: 1,
    title: "Guía de Adopción Responsable",
    description: "Todo lo que necesitas saber antes de adoptar una mascota",
    image: "https://images.pexels.com/photos/5745229/pexels-photo-5745229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Adopción",
    readTime: "5 min",
    difficulty: "Principiante",
    points: [
      "Evaluar tu estilo de vida y disponibilidad",
      "Considerar el espacio y recursos necesarios",
      "Investigar sobre la raza o tipo de animal",
      "Preparar tu hogar para la llegada",
      "Planificar los gastos veterinarios"
    ]
  },
  {
    id: 2,
    title: "Cuidados Básicos para Perros",
    description: "Los fundamentos esenciales para el bienestar de tu perro",
    image: "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Cuidados",
    readTime: "8 min",
    difficulty: "Principiante",
    points: [
      "Alimentación balanceada y horarios",
      "Ejercicio diario y estimulación mental",
      "Higiene y cuidado del pelaje",
      "Vacunación y control veterinario",
      "Socialización y entrenamiento básico"
    ]
  },
  {
    id: 3,
    title: "Cuidados Básicos para Gatos",
    description: "Todo sobre el cuidado y bienestar de tu gato",
    image: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Cuidados",
    readTime: "6 min",
    difficulty: "Principiante",
    points: [
      "Alimentación específica para gatos",
      "Arenero y limpieza",
      "Enriquecimiento ambiental",
      "Cuidado dental y veterinario",
      "Comportamiento y comunicación felina"
    ]
  },
  {
    id: 4,
    title: "Primeros Auxilios para Mascotas",
    description: "Qué hacer en caso de emergencia con tu mascota",
    image: "https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Salud",
    readTime: "10 min",
    difficulty: "Intermedio",
    points: [
      "Signos de emergencia a reconocer",
      "Botiquín básico para mascotas",
      "Manejo de heridas menores",
      "Intoxicaciones comunes",
      "Cuándo acudir al veterinario"
    ]
  },
  {
    id: 5,
    title: "Adaptación Post-Adopción",
    description: "Cómo ayudar a tu nueva mascota a adaptarse a su hogar",
    image: "https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Adopción",
    readTime: "7 min",
    difficulty: "Principiante",
    points: [
      "Crear un espacio seguro y cómodo",
      "Establecer rutinas y límites",
      "Socialización gradual",
      "Manejo de ansiedad y estrés",
      "Integración con otros animales"
    ]
  },
  {
    id: 6,
    title: "Nutrición y Alimentación",
    description: "Guía completa sobre la alimentación saludable para mascotas",
    image: "https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Salud",
    readTime: "12 min",
    difficulty: "Intermedio",
    points: [
      "Tipos de alimentos y sus beneficios",
      "Cantidades y frecuencias de alimentación",
      "Alimentos tóxicos a evitar",
      "Suplementos y vitaminas",
      "Alimentación según edad y actividad"
    ]
  }
];

const categories = [
  { name: "Adopción", icon: Heart, color: "bg-red-100 text-red-700" },
  { name: "Cuidados", icon: Shield, color: "bg-blue-100 text-blue-700" },
  { name: "Salud", icon: BookOpen, color: "bg-green-100 text-green-700" }
];

export default function Education() {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <Badge variant="secondary" className="text-sm">Recursos Educativos</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Aprende a cuidar a tu{" "}
              <span className="text-primary">mejor amigo</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nuestra biblioteca de recursos te ayudará a convertirte en el mejor cuidador para tu mascota. 
              Desde adopción responsable hasta cuidados avanzados.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Badge key={category.name} variant="outline" className="text-sm">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 lg:mb-16">
            <div className="text-center p-6 bg-background rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{educationalContent.length}</h3>
              <p className="text-muted-foreground">Artículos disponibles</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">48 min</h3>
              <p className="text-muted-foreground">Tiempo total de lectura</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">3</h3>
              <p className="text-muted-foreground">Categorías principales</p>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {educationalContent.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {article.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {article.points.slice(0, 3).map((point, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                    {article.points.length > 3 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{article.points.length - 3} puntos más...
                      </p>
                    )}
                  </div>
                  
                  <Button className="w-full group/btn" variant="outline">
                    Leer artículo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 lg:mt-20">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  ¿Quieres recibir más consejos?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Suscríbete a nuestro boletín y recibe consejos semanales sobre el cuidado de mascotas, 
                  historias de adopción exitosas y novedades del refugio.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Tu correo electrónico"
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button className="whitespace-nowrap">
                    Suscribirse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 