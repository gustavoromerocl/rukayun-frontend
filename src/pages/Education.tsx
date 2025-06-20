import { Button } from "@/components/ui/button";

export default function Education() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Banner con gradiente */}
      <div className="w-full h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />

      <div className="container mx-auto py-12 px-4 text-center -mt-32">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8">Sección educativa</h1>

          <div className="w-full max-w-2xl mx-auto">
            <img 
              src="https://images.pexels.com/photos/5745229/pexels-photo-5745229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Persona leyendo sobre cuidado de mascotas"
              className="w-full h-56 object-cover rounded-md mb-6"
            />

            <h2 className="text-2xl font-semibold mb-4">Adopción responsable</h2>
            <p className="text-muted-foreground mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Button>Leer más</Button>
          </div>
        </div>
      </div>
    </section>
  );
} 