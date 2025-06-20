export function AnimalCard({ name, description, image }: { name: string; description: string; image?: string }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-card hover:shadow-lg transition-shadow duration-300">
      <img 
        src={image || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
        alt={`Foto de ${name}`}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg text-card-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 