import { AnimalCard } from "@/components/AnimalCard";
import { Input } from "@/components/ui/input";

// Sample data for animals
const animals = [
  { name: "Fido", description: "Juguetón y amigable" },
  { name: "Milo", description: "Leal y cariñoso" },
  { name: "Luna", description: "Independiente y curiosa" },
  { name: "Rocky", description: "Energético y protector" },
  { name: "Bella", description: "Tranquila y dulce" },
  { name: "Max", description: "Inteligente y obediente" },
];

export default function Animals() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner */}
      <div className="w-full h-64 bg-gray-200" />

      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Animales disponibles</h1>
        <div className="w-full max-w-sm mx-auto mb-8">
          <Input type="search" placeholder="Filtro de búsqueda" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {animals.map((animal) => (
            <AnimalCard key={animal.name} name={animal.name} description={animal.description} />
          ))}
        </div>
      </div>
    </section>
  );
} 