import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="w-full flex flex-col items-center pb-12">
      {/* Banner grande y centrado */}
      <div className="w-full h-80 bg-gray-200 rounded" />
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-6">Encuentra a tu mascota ideal</h1>
        <Button className="mb-6 w-full max-w-xs">Ver animales en adopción</Button>
        <a href="#" className="text-sm text-blue-600 underline mb-2">Aprende más sobre adopción responsable</a>
        <a href="#" className="text-sm text-blue-600 underline">Contáctanos para más información</a>
      </div>
    </section>
  );
} 