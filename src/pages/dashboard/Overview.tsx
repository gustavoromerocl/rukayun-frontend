export default function Overview() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">¡Bienvenido al panel de administración!</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-start">
          <span className="text-muted-foreground text-sm mb-2">Total de animales</span>
          <span className="text-3xl font-bold">128</span>
        </div>
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-start">
          <span className="text-muted-foreground text-sm mb-2">Solicitudes pendientes</span>
          <span className="text-3xl font-bold">12</span>
        </div>
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-start">
          <span className="text-muted-foreground text-sm mb-2">Adopciones este mes</span>
          <span className="text-3xl font-bold">7</span>
        </div>
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-start">
          <span className="text-muted-foreground text-sm mb-2">Seguimientos activos</span>
          <span className="text-3xl font-bold">21</span>
        </div>
      </div>
      <div className="bg-background rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Gráfico de actividad (próximamente)</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          [Aquí irá un gráfico de actividad]
        </div>
      </div>
    </div>
  );
} 