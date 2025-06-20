import { AnimalCard } from "@/components/AnimalCard";
import { Input } from "@/components/ui/input";

// Sample data for animals with images
const animals = [
  { name: "Fido", description: "Juguetón y amigable", image: "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Milo", description: "Leal y cariñoso", image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Luna", description: "Independiente y curiosa", image: "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Rocky", description: "Energético y protector", image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Bella", description: "Tranquila y dulce", image: "https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { name: "Max", description: "Inteligente y obediente", image: "https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
];

export default function Animals() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner con gradiente */}
      <div className="w-full h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />

      <div className="container mx-auto py-12 px-4 -mt-32">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-4">Animales disponibles</h1>
          <div className="w-full max-w-sm mx-auto mb-8">
            <Input type="search" placeholder="Filtro de búsqueda" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {animals.map((animal) => (
              <AnimalCard key={animal.name} name={animal.name} description={animal.description} image={animal.image} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 