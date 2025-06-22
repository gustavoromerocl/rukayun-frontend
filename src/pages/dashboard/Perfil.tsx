import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Aquí puedes actualizar la información de tu cuenta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu nombre, apellidos y correo electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" defaultValue="Gustavo" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" defaultValue="Romero" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" defaultValue="gustavo.romero@example.com" disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 