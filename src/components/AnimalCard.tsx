export function AnimalCard({ name, description, image }: { name: string; description: string; image?: string }) {
  return (
    <div className="group border rounded-xl p-4 sm:p-6 shadow-sm bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={image || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
          alt={`Foto de ${name}`}
          className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg sm:text-xl text-card-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="pt-2">
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300">
            Conocer más →
          </button>
        </div>
      </div>
    </div>
  );
} 