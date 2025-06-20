export function AnimalCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {/* Placeholder for animal image */}
      <div className="w-full h-32 bg-gray-200 rounded mb-4" />
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
} 