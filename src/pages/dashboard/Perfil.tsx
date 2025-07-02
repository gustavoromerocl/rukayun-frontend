import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useComunas } from "@/hooks/useComunas"
import { useMsal } from "@azure/msal-react"
import { useApi } from "@/hooks/useApi"
import { UsuariosService } from "@/services/usuariosService"
import { 
  User, 
  Mail, 
  Shield, 
  Activity,
  Edit3,
  Camera,
  Save,
  X,
} from "lucide-react"
import { toast } from "sonner"

export default function PerfilPage() {
  const { usuario, loading, error, recargarPerfil } = useAuth()
  const { comunas, loading: comunasLoading } = useComunas()
  const { accounts } = useMsal()
  const apiClient = useApi()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Obtener datos del usuario desde MSAL para información adicional
  const msalUser = accounts[0]
  
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    telefono2: "",
    direccion: "",
    comunaId: null as number | null
  })

  // Inicializar datos del formulario con datos del backend
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        telefono: usuario.telefono || "",
        telefono2: usuario.telefono2 || "",
        direccion: usuario.direccion || "",
        comunaId: usuario.comuna?.comunaId || null
      })
    }
  }, [usuario])

  const handleSave = async () => {
    if (!usuario) return
    
    setIsSaving(true)
    try {
      const usuariosService = new UsuariosService(apiClient)
      await usuariosService.actualizarPerfil(formData)
      
      toast.success("Perfil actualizado correctamente")
      setIsEditing(false)
      recargarPerfil() // Recargar datos del backend
    } catch (error) {
      toast.error("Error al actualizar el perfil")
      console.error("Error actualizando perfil:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        telefono: usuario.telefono || "",
        telefono2: usuario.telefono2 || "",
        direccion: usuario.direccion || "",
        comunaId: usuario.comuna?.comunaId || null
      })
    }
    setIsEditing(false)
  }

  const getInitials = (nombres: string, apellidos: string) => {
    if (!nombres || !apellidos) return "U";
    return `${nombres[0] || ""}${apellidos[0] || ""}`.toUpperCase()
  }

  // Obtener el nombre de la comuna actual
  const getCurrentComunaNombre = () => {
    return usuario?.comuna?.nombre || "";
  }

  // Mostrar loading mientras se cargan los datos
  if (loading || comunasLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Mi Perfil</h2>
            <p className="text-muted-foreground">
              Gestiona tu información personal y configuración de cuenta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Tu información básica y datos personales.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Nombres</Label>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <Label>Apellidos</Label>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Dirección</Label>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <Label>Comuna</Label>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  Tus datos de contacto y ubicación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Correo Electrónico</Label>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <Label>Teléfono</Label>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <Label>Teléfono 2 (Opcional)</Label>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configuración de Cuenta
                </CardTitle>
                <CardDescription>
                  Configuración de seguridad y preferencias.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Estado de la cuenta</h4>
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Rol en el sistema</h4>
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Fecha de registro</h4>
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar y Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="text-center">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error si no se pudo cargar el perfil
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Mi Perfil</h2>
            <p className="text-muted-foreground">
              Gestiona tu información personal y configuración de cuenta.
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="mb-4">Error al cargar el perfil: {error}</p>
              <Button onClick={recargarPerfil} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si no hay usuario, mostrar mensaje
  if (!usuario) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Mi Perfil</h2>
            <p className="text-muted-foreground">
              Gestiona tu información personal y configuración de cuenta.
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mb-4">No se pudo cargar la información del perfil.</p>
              <Button onClick={recargarPerfil} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recentActivity = [
    {
      id: 1,
      action: "Adoptaste a Luna",
      date: "2024-01-15",
      type: "adoption"
    },
    {
      id: 2,
      action: "Actualizaste tu perfil",
      date: "2024-01-10",
      type: "profile"
    },
    {
      id: 3,
      action: "Donaste $50 a la fundación",
      date: "2024-01-05",
      type: "donation"
    },
    {
      id: 4,
      action: "Participaste en evento de adopción",
      date: "2023-12-20",
      type: "event"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Mi Perfil</h2>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Tu información básica y datos personales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input 
                    id="nombres" 
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input 
                    id="apellidos" 
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="direccion">Dirección</Label>
                <Input 
                  id="direccion" 
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="comuna">Comuna</Label>
                {isEditing ? (
                  <Select
                    value={formData.comunaId?.toString() || ""}
                    onValueChange={(value) => setFormData({...formData, comunaId: value ? Number(value) : null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna.comunaId} value={comuna.comunaId.toString()}>
                          {comuna.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    value={getCurrentComunaNombre()}
                    disabled
                    className="bg-muted"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Tus datos de contacto y ubicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={msalUser?.username || usuario?.username || ""}
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+593 99 123 4567"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="telefono2">Teléfono 2 (Opcional)</Label>
                <Input 
                  id="telefono2" 
                  value={formData.telefono2}
                  onChange={(e) => setFormData({...formData, telefono2: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+593 98 765 4321"
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Cuenta
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y preferencias.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Estado de la cuenta</h4>
                  <p className="text-sm text-muted-foreground">
                    Tu cuenta está {usuario?.activo ? "activa" : "inactiva"}
                  </p>
                </div>
                <Badge variant={usuario?.activo ? "secondary" : "destructive"}>
                  {usuario?.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Rol en el sistema</h4>
                  <p className="text-sm text-muted-foreground">
                    {usuario?.rol || "Usuario"}
                  </p>
                </div>
                <Badge variant="outline">{usuario?.rol || "Usuario"}</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Fecha de registro</h4>
                  <p className="text-sm text-muted-foreground">
                    {usuario?.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString('es-ES') : "No disponible"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Comuna</h4>
                  <p className="text-sm text-muted-foreground">
                    {usuario.comuna?.nombre || "No especificada"}
                  </p>
                </div>
                <Badge variant="outline">
                  {usuario.comuna?.nombre || "Sin comuna"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar y Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" alt={usuario?.nombres || "Usuario"} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(usuario?.nombres || "", usuario?.apellidos || "")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="secondary"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{usuario?.nombres} {usuario?.apellidos}</h3>
                  <p className="text-sm text-muted-foreground">
                    {usuario?.fechaCreacion ? `Miembro desde ${new Date(usuario.fechaCreacion).getFullYear()}` : "Miembro"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{usuario?.username}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground">Adopciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Voluntariados</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botones de acción */}
      {isEditing && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      )}
    </div>
  )
} 