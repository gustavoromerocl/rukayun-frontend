import { Button } from "@/components/ui/button";
import { AnimalCard } from "@/components/AnimalCard";
import { Heart, BookOpen, Users } from "lucide-react";

// Sample data for featured animals
const featuredAnimals = [
  { name: "Fido", description: "Juguetón y amigable", image: "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Luna", description: "Independiente y curiosa", image: "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Rocky", description: "Energético y protector", image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-start text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight">
                Encuentra a tu{" "}
                <span className="text-primary">compañero fiel</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl">
                Abrimos las puertas de nuestro refugio para que descubras la alegría de adoptar. Cada mascota tiene una historia y está esperando un hogar lleno de amor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3">
                  Ver animales en adopción
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-3">
                  Conoce nuestro refugio
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <img 
                src="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Mujer jugando con su perro"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pillars Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir Rukayun?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Nuestro compromiso va más allá de conectar mascotas con familias. Te acompañamos en cada paso del proceso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-4 p-6 lg:p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
              <div className="p-3 bg-primary/10 rounded-full">
                <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-center">Adopción Responsable</h3>
              <p className="text-muted-foreground text-center text-sm lg:text-base">
                Te guiamos en cada paso para asegurar un futuro feliz tanto para ti como para tu nueva mascota.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 lg:p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
              <div className="p-3 bg-secondary/10 rounded-full">
                <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-secondary" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-center">Educación y Recursos</h3>
              <p className="text-muted-foreground text-center text-sm lg:text-base">
                Ofrecemos recursos y consejos para que la adaptación en el nuevo hogar sea un proceso fácil y feliz.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 lg:p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 md:col-span-2 lg:col-span-1">
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-accent" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-center">Comunidad y Soporte</h3>
              <p className="text-muted-foreground text-center text-sm lg:text-base">
                Únete a una comunidad de amantes de los animales y comparte tus experiencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Animals Section */}
      <section className="w-full bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Conoce a algunos amigos que esperan por ti
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada uno de estos hermosos animales está listo para llenar tu vida de amor y alegría.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {featuredAnimals.map((animal) => (
              <AnimalCard key={animal.name} name={animal.name} description={animal.description} image={animal.image} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="text-base px-8 py-3">
              Ver todos los animales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 