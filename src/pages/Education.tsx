import { Button } from "@/components/ui/button";

export default function Education() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner */}
      <div className="w-full h-64 bg-gray-200" />

      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8">Sección educativa</h1>

        <div className="w-full max-w-2xl mx-auto">
          {/* Image placeholder */}
          <div className="w-full h-56 bg-gray-300 rounded mb-6" />

          <h2 className="text-2xl font-semibold mb-4">Adopción responsable</h2>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <Button>Leer más</Button>
        </div>
      </div>
    </section>
  );
} 