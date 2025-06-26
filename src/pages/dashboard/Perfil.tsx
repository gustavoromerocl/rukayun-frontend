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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { useMsal } from "@azure/msal-react"
import { 
  User, 
  Mail, 
  Shield, 
  Activity,
  Edit3,
  Camera,
  Save,
  X
} from "lucide-react"

export default function PerfilPage() {
  const { user: storeUser, setUser } = useAppStore()
  const { accounts } = useMsal()
  const [isEditing, setIsEditing] = useState(false)
  
  // Obtener datos del usuario desde MSAL
  const msalUser = accounts[0]
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+593 99 123 4567",
    address: "Quito, Ecuador",
    bio: "Amante de los animales y voluntario en adopciones. Me encanta ayudar a encontrar hogares para mascotas necesitadas.",
    birthDate: "1995-03-15"
  })

  // Inicializar datos del formulario con datos de MSAL o del store
  useEffect(() => {
    if (msalUser) {
      const msalName = msalUser.name || msalUser.username || ""
      const msalEmail = msalUser.username || ""
      
      setFormData(prev => ({
        ...prev,
        name: storeUser?.name || msalName,
        email: storeUser?.email || msalEmail
      }))
      
      // Si no hay usuario en el store, crear uno basado en MSAL
      if (!storeUser) {
        const userRole = msalUser.idTokenClaims?.extension_Role || msalUser.idTokenClaims?.role || 'user';
        setUser({
          id: String(msalUser.localAccountId || msalUser.homeAccountId || msalUser.username || ""),
          name: msalName,
          email: msalEmail,
          role: typeof userRole === 'string' ? userRole : 'user'
        })
      }
    }
  }, [msalUser, storeUser, setUser])

  const handleSave = () => {
    if (storeUser) {
      setUser({
        ...storeUser,
        name: formData.name
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(prev => ({
      ...prev,
      name: storeUser?.name || msalUser?.name || msalUser?.username || "",
      email: storeUser?.email || msalUser?.username || ""
    }))
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
                  <Label htmlFor="name">Nombres</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input 
                    id="birthDate" 
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
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
                  value={formData.email}
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address">Dirección</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  disabled={!isEditing}
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
                  <h4 className="font-medium">Notificaciones por Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones sobre adopciones
                  </p>
                </div>
                <Badge variant="secondary">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Verificación en Dos Pasos</h4>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Badge variant="outline">Inactivo</Badge>
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
                    <AvatarImage src="" alt={storeUser?.name || "Usuario"} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(storeUser?.name || "Usuario")}
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
                  <h3 className="font-semibold text-lg">{storeUser?.name}</h3>
                  <p className="text-sm text-muted-foreground">Miembro desde 2023</p>
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
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  )
} 