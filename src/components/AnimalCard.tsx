import type { Animal } from "@/services/animalesService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnimalCardProps {
  animal: Animal | undefined;
  onAdopt?: (animal: Animal) => void;
  onDetails?: (animal: Animal) => void;
  showAdoptButton?: boolean;
  showDetailsButton?: boolean;
  adoptButtonLabel?: string;
  detailsButtonLabel?: string;
  className?: string;
}

export function AnimalCard({
  animal,
  onAdopt,
  onDetails,
  showAdoptButton = true,
  showDetailsButton = true,
  adoptButtonLabel = "Solicitar Adopción",
  detailsButtonLabel = "Conocer más →",
  className = "",
}: AnimalCardProps) {
  if (!animal) return null;
  const imagenUrl = Array.isArray(animal.animalImagenes) && animal.animalImagenes.length > 0
    ? animal.animalImagenes[0]?.url
    : "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div
      className={`group border rounded-xl p-4 sm:p-6 shadow-sm bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden flex flex-col ${className}`}
      style={{ minHeight: 420 }}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={imagenUrl}
          alt={`Foto de ${animal.nombre}`}
          className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="space-y-2 flex-1 flex flex-col">
        <h3 className="font-bold text-lg sm:text-xl text-card-foreground group-hover:text-primary transition-colors duration-300">
          {animal.nombre}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Badge variant="outline">{animal.especie?.nombre}</Badge>
          <Badge variant="outline">{animal.sexo?.nombre}</Badge>
          <Badge variant="outline">{animal.tamano?.nombre}</Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {animal.descripcion}
        </p>
        <div className="pt-2 flex flex-col gap-2 w-full mt-auto">
          {showDetailsButton && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary w-full justify-center"
              onClick={() => onDetails?.(animal)}
            >
              {detailsButtonLabel}
            </Button>
          )}
          {showAdoptButton && (
            <Button
              onClick={() => onAdopt?.(animal)}
              size="sm"
              className="bg-primary hover:bg-primary/90 w-full justify-center"
            >
              {adoptButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 