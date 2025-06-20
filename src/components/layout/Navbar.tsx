import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b bg-white">
      {/* Logo placeholder */}
      <div className="w-8 h-8 bg-gray-200 rounded" />
      <div className="flex gap-6">
        <Button variant="ghost">Animales</Button>
        <Button variant="ghost">Educación</Button>
        <Button variant="ghost">Contacto</Button>
      </div>
    </nav>
  );
} 