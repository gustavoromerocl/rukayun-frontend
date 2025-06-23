import { AnimalCard } from "@/components/AnimalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart } from "lucide-react";
import { useState } from "react";

// Sample data for animals with more details
const animals = [
  { 
    name: "Fido", 
    description: "Juguetón y amigable", 
    image: "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Perro",
    age: "2 años",
    size: "Mediano"
  },
  { 
    name: "Milo", 
    description: "Leal y cariñoso", 
    image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Perro",
    age: "1 año",
    size: "Grande"
  },
  { 
    name: "Luna", 
    description: "Independiente y curiosa", 
    image: "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Gato",
    age: "3 años",
    size: "Pequeño"
  },
  { 
    name: "Rocky", 
    description: "Energético y protector", 
    image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Perro",
    age: "4 años",
    size: "Grande"
  },
  { 
    name: "Bella", 
    description: "Tranquila y dulce", 
    image: "https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Gato",
    age: "2 años",
    size: "Mediano"
  },
  { 
    name: "Max", 
    description: "Inteligente y obediente", 
    image: "https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    type: "Perro",
    age: "3 años",
    size: "Mediano"
  },
];

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || animal.type === selectedType;
    const matchesSize = selectedSize === "all" || animal.size === selectedSize;
    
    return matchesSearch && matchesType && matchesSize;
  });

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Encuentra a tu{" "}
              <span className="text-primary">compañero perfecto</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cada uno de estos hermosos animales está esperando encontrar un hogar lleno de amor. 
              Conoce sus historias y descubre cuál podría ser tu nuevo mejor amigo.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{animals.length} animales esperando adopción</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-6 lg:p-8 mb-8 lg:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="search" 
                  placeholder="Buscar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los animales</SelectItem>
                  <SelectItem value="Perro">Perros</SelectItem>
                  <SelectItem value="Gato">Gatos</SelectItem>
                </SelectContent>
              </Select>

              {/* Size Filter */}
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tamaños</SelectItem>
                  <SelectItem value="Pequeño">Pequeño</SelectItem>
                  <SelectItem value="Mediano">Mediano</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedSize("all");
                }}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Limpiar filtros
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <p className="text-muted-foreground">
              Mostrando {filteredAnimals.length} de {animals.length} animales
            </p>
            {filteredAnimals.length === 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedSize("all");
                }}
              >
                Ver todos los animales
              </Button>
            )}
          </div>

          {/* Animals Grid */}
          {filteredAnimals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredAnimals.map((animal) => (
                <AnimalCard 
                  key={animal.name} 
                  name={animal.name} 
                  description={`${animal.description} • ${animal.age} • ${animal.size}`} 
                  image={animal.image} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 lg:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron animales
                </h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar tus filtros de búsqueda o vuelve más tarde.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedSize("all");
                  }}
                >
                  Ver todos los animales
                </Button>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {filteredAnimals.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Cargar más animales
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 