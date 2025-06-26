
export default function Dashboard() {
  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Bienvenido al Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Has ingresado correctamente.
        </p>
        {/* El botón de logout se implementará en el layout principal */}
      </div>
    </div>
  );
} 