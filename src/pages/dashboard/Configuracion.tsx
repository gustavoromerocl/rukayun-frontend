"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { Switch } from "@/components/ui/switch"
import { useOrganizaciones } from "@/hooks/useOrganizaciones"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Loader2, Lock, User } from "lucide-react"

export default function Configuracion() {
  const { isColaborator } = useAppStore()
  const { usuario } = useAuth()
  const [activeTab, setActiveTab] = React.useState(isColaborator ? "perfil" : "apariencia")
  const { obtenerMiOrganizacion } = useOrganizaciones()
  const [miOrganizacion, setMiOrganizacion] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Cambiar pestaña activa según el rol
  React.useEffect(() => {
    setActiveTab(isColaborator ? "perfil" : "apariencia")
  }, [isColaborator])

  // Cargar datos de mi organización solo si es colaborador - SOLUCIÓN CON useRef
  const hasLoadedRef = React.useRef(false);
  
  React.useEffect(() => {
    if (!isColaborator) {
      // Usuarios no colaboradores no tienen organización
      setLoading(false)
      return
    }

    // Evitar múltiples llamadas
    if (hasLoadedRef.current) {
      console.log('🔄 useEffect ya ejecutado, evitando llamada duplicada');
      return;
    }
    
    console.log('🔄 useEffect ejecutándose por primera vez');

    const cargarMiOrganizacion = async () => {
      setLoading(true)
      setError(null)
      try {
        const organizacion = await obtenerMiOrganizacion()
        setMiOrganizacion(organizacion)
      } catch (err) {
        console.error('Error cargando mi organización:', err)
        setError('Error al cargar los datos de la organización')
        toast.error('Error al cargar los datos de la organización')
      } finally {
        setLoading(false)
      }
    }

    cargarMiOrganizacion()
    hasLoadedRef.current = true;
    console.log('✅ useEffect completado, hasLoadedRef establecido en true');
  }, [isColaborator]) // Sin obtenerMiOrganizacion en las dependencias

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          {isColaborator 
            ? "Gestiona el perfil de tu organización, apariencia y notificaciones."
            : "Gestiona tu perfil personal, apariencia y notificaciones."
          }
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <nav className="md:col-span-1 space-y-1">
          {isColaborator && (
            <Button variant={activeTab === 'perfil' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('perfil')} className="w-full justify-start">
              Perfil
            </Button>
          )}
          <Button variant={activeTab === 'apariencia' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('apariencia')} className="w-full justify-start">
            Apariencia
          </Button>
          <Button variant={activeTab === 'notificaciones' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('notificaciones')} className="w-full justify-start">
            Notificaciones
          </Button>
        </nav>

        <div className="md:col-span-3">
          {activeTab === 'perfil' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isColaborator ? <Lock className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  {isColaborator ? "Perfil de la Organización" : "Mi Perfil Personal"}
                </CardTitle>
                <CardDescription>
                  {isColaborator 
                    ? "Información de tu organización (solo lectura)."
                    : "Información de tu perfil personal."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isColaborator ? (
                  // Vista para colaboradores
                  <>
                    {loading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span>Cargando datos de la organización...</span>
                      </div>
                    )}
                    
                    {error && (
                      <div className="text-center text-red-600 py-4">
                        <p>{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-2">
                          Reintentar
                        </Button>
                      </div>
                    )}

                    {!loading && !error && miOrganizacion && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="org-name">Nombre del Refugio</Label>
                          <Input id="org-name" value={miOrganizacion.nombre} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-email">Email de Contacto</Label>
                          <Input id="org-email" type="email" value={miOrganizacion.emailContacto} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-phone">Teléfono</Label>
                          <Input id="org-phone" type="tel" value={miOrganizacion.telefonoContacto} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-address">Dirección</Label>
                          <Input id="org-address" value={miOrganizacion.direccion} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-comuna">Comuna</Label>
                          <Input id="org-comuna" value={miOrganizacion.comuna?.nombre || 'No especificada'} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-description">Descripción Breve</Label>
                          <Textarea
                            id="org-description"
                            value="Información de la organización obtenida del sistema."
                            disabled
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Vista para usuarios adoptantes
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Nombre Completo</Label>
                      <Input 
                        id="user-name" 
                        value={usuario ? `${usuario.nombres} ${usuario.apellidos}` : ''} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input 
                        id="user-email" 
                        type="email" 
                        value={usuario?.email || usuario?.username || ''} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-phone">Teléfono</Label>
                      <Input 
                        id="user-phone" 
                        type="tel" 
                        value={usuario?.telefono || 'No especificado'} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-address">Dirección</Label>
                      <Input 
                        id="user-address" 
                        value={usuario?.direccion || 'No especificada'} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-comuna">Comuna</Label>
                      <Input 
                        id="user-comuna" 
                        value={usuario?.comuna?.nombre || 'No especificada'} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-role">Rol</Label>
                      <Input 
                        id="user-role" 
                        value={usuario?.rol || 'Usuario'} 
                        disabled 
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  {isColaborator 
                    ? "Los datos de la organización son administrados por el sistema."
                    : "Tu perfil personal es gestionado por el sistema."
                  }
                </div>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'apariencia' && (
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el tema para el dashboard.
                    </p>
                  </div>
                  <ModeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Idioma</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el idioma de la interfaz.
                    </p>
                  </div>
                  <Select defaultValue="es">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notificaciones' && (
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Elige cómo quieres recibir notificaciones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activa o desactiva todas las notificaciones por correo.
                    </p>
                  </div>
                  <Switch id="notifications-email" defaultChecked />
                </div>
                <div className="space-y-3 pt-4">
                  <h4 className="text-sm font-medium mb-2">Alertas Específicas</h4>
                  <div className="space-y-3">
                    {isColaborator ? (
                      // Notificaciones para colaboradores
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-solicitud" className="font-normal">
                            Nuevas solicitudes de adopción
                          </Label>
                          <Switch id="notification-solicitud" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-seguimiento" className="font-normal">
                            Recordatorios de seguimiento
                          </Label>
                          <Switch id="notification-seguimiento" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-contacto" className="font-normal">
                            Nuevos mensajes de contacto
                          </Label>
                          <Switch id="notification-contacto" defaultChecked />
                        </div>
                      </>
                    ) : (
                      // Notificaciones para usuarios adoptantes
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-estado-solicitud" className="font-normal">
                            Cambios en el estado de mis solicitudes
                          </Label>
                          <Switch id="notification-estado-solicitud" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-seguimiento-personal" className="font-normal">
                            Recordatorios de seguimiento de mis adopciones
                          </Label>
                          <Switch id="notification-seguimiento-personal" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-nuevas-mascotas" className="font-normal">
                            Nuevas mascotas disponibles
                          </Label>
                          <Switch id="notification-nuevas-mascotas" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Guardar Preferencias</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 