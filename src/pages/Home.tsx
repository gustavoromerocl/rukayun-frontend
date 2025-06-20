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
      <section className="w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
          <div className="flex flex-col gap-4 items-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Encuentra a tu compañero fiel
            </h1>
            <p className="text-lg text-muted-foreground">
              Abrimos las puertas de nuestro refugio para que descubras la alegría de adoptar. Cada mascota tiene una historia y está esperando un hogar lleno de amor.
            </p>
            <Button size="lg" className="mt-4">Ver animales en adopción</Button>
          </div>
          <img 
            src="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Mujer jugando con su perro"
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* 2. Pillars Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm">
              <Heart className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-bold">Adopción Responsable</h3>
              <p className="text-muted-foreground">Te guiamos en cada paso para asegurar un futuro feliz tanto para ti como para tu nueva mascota.</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm">
              <BookOpen className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-bold">Educación y Recursos</h3>
              <p className="text-muted-foreground">Ofrecemos recursos y consejos para que la adaptación en el nuevo hogar sea un proceso fácil y feliz.</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-bold">Comunidad y Soporte</h3>
              <p className="text-muted-foreground">Únete a una comunidad de amantes de los animales y comparte tus experiencias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Animals Section */}
      <section className="w-full bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Conoce a algunos amigos que esperan por ti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredAnimals.map((animal) => (
              <AnimalCard key={animal.name} name={animal.name} description={animal.description} image={animal.image} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 