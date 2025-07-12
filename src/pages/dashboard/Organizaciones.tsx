import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Building2, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Users,
  MapPin,
  Phone,
  Users2,
  Loader2
} from "lucide-react"
import { useOrganizaciones } from "@/hooks/useOrganizaciones"
import { useComunas } from "@/hooks/useComunas"
import { toast } from "sonner"
import type { Organizacion, Usuario } from "@/services/usuariosService"

export default function OrganizacionesPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isGestionarUsuariosOpen, setIsGestionarUsuariosOpen] = React.useState(false)
  const [selectedOrganizacion, setSelectedOrganizacion] = React.useState<Organizacion | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)
  const [searchTerm, setSearchTerm] = React.useState("")

  // Usar el hook de organizaciones
  const { 
    organizaciones, 
    loading, 
    error, 
    fetchOrganizaciones, 
    deleteOrganizacion,
    createOrganizacion,
    updateOrganizacion,
    agregarUsuarioAOrganizacion,
    removerUsuarioDeOrganizacion,
    obtenerUsuariosDeOrganizacion,
    obtenerTodosLosUsuarios
  } = useOrganizaciones()

  // Usar el hook de comunas
  const { comunas } = useComunas()

  // Cargar datos al montar el componente - SOLUCIÓN CON useRef
  const hasLoadedRef = React.useRef(false);
  
  React.useEffect(() => {
    // Evitar múltiples llamadas
    if (hasLoadedRef.current) {
      console.log('🔄 useEffect ya ejecutado, evitando llamada duplicada');
      return;
    }
    
    console.log('🔄 useEffect ejecutándose por primera vez');
    fetchOrganizaciones()
    hasLoadedRef.current = true;
    console.log('✅ useEffect completado, hasLoadedRef establecido en true');
  }, []) // Sin dependencias para evitar recreaciones

  // Efecto para refrescar la tabla cuando cambie el refreshTrigger
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 Refrescando tabla por trigger:', refreshTrigger)
      fetchOrganizaciones()
    }
  }, [refreshTrigger, fetchOrganizaciones])

  const handleEdit = (organizacion: Organizacion) => {
    setSelectedOrganizacion(organizacion)
    setIsFormOpen(true)
  }

  const handleDelete = (organizacion: Organizacion) => {
    setSelectedOrganizacion(organizacion)
    setIsDeleteOpen(true)
  }

  const handleViewDetails = (organizacion: Organizacion) => {
    setSelectedOrganizacion(organizacion)
    setIsDetailsOpen(true)
  }

  const handleGestionarUsuarios = (organizacion: Organizacion) => {
    setSelectedOrganizacion(organizacion)
    setIsGestionarUsuariosOpen(true)
  }

  const handleAddNew = () => {
    setSelectedOrganizacion(null)
    setIsFormOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedOrganizacion) {
      try {
        console.log('🗑️ Confirmando eliminación de organización:', selectedOrganizacion.organizacionId);
        await deleteOrganizacion(selectedOrganizacion.organizacionId)
        
        // Cerrar el diálogo de confirmación
        setIsDeleteOpen(false)
        setSelectedOrganizacion(null)
        
        // Mostrar mensaje de éxito
        toast.success(`Organización "${selectedOrganizacion.nombre}" eliminada exitosamente`)
        
        // Refrescar la tabla después de un pequeño delay
        setTimeout(async () => {
          try {
            console.log('🔄 Refrescando tabla después de eliminar organización...')
            await fetchOrganizaciones()
            console.log('✅ Tabla refrescada exitosamente')
          } catch (refreshError) {
            console.error('❌ Error al refrescar tabla:', refreshError)
            toast.warning('Organización eliminada, pero hubo un problema al actualizar la lista.')
          }
        }, 500)
        
      } catch (error) {
        console.error('Error al eliminar organización:', error)
        toast.error('Ocurrió un error al eliminar la organización. Intenta nuevamente.')
      }
    }
  }

  // Filtrar organizaciones por término de búsqueda
  const filteredOrganizaciones = organizaciones.filter(org =>
    org.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.nombreContacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.emailContacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.comuna?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estadísticas
  const totalOrganizaciones = organizaciones.length
  const organizacionesActivas = organizaciones.filter(org => !org.fechaEliminacion).length
  const organizacionesEliminadas = organizaciones.filter(org => org.fechaEliminacion).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Organizaciones</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eliminadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Organizaciones</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error al cargar las organizaciones: {error}</p>
              <Button onClick={() => fetchOrganizaciones()} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Organizaciones</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Organización
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrganizaciones}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizacionesActivas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eliminadas</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizacionesEliminadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Organizaciones</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar organizaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organización</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizaciones.map((organizacion) => (
                  <TableRow key={organizacion.organizacionId}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {organizacion.nombre.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{organizacion.nombre}</div>
                          <div className="text-sm text-muted-foreground">{organizacion.emailContacto}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{organizacion.nombreContacto}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {organizacion.telefonoContacto}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{organizacion.comuna?.nombre || "Sin comuna"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {organizacion.usuariosId.length} usuarios
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={organizacion.fechaEliminacion ? "destructive" : "secondary"}>
                        {organizacion.fechaEliminacion ? "Eliminada" : "Activa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(organizacion)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGestionarUsuarios(organizacion)}>
                            <Users2 className="mr-2 h-4 w-4" />
                            Gestionar Usuarios
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(organizacion)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(organizacion)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrganizaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron organizaciones.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Organización */}
      <OrganizacionFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        organizacion={selectedOrganizacion}
        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        comunas={comunas}
        createOrganizacion={createOrganizacion}
        updateOrganizacion={updateOrganizacion}
      />

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        organizacionName={selectedOrganizacion?.nombre}
        onConfirm={handleConfirmDelete}
      />

      {/* Diálogo de detalles */}
      <OrganizacionDetailsDialog
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        organizacion={selectedOrganizacion}
      />

      {/* Componente para gestionar usuarios de una organización */}
      <GestionarUsuariosDialog
        isOpen={isGestionarUsuariosOpen}
        setIsOpen={setIsGestionarUsuariosOpen}
        organizacion={selectedOrganizacion}
        agregarUsuarioAOrganizacion={agregarUsuarioAOrganizacion}
        removerUsuarioDeOrganizacion={removerUsuarioDeOrganizacion}
        obtenerUsuariosDeOrganizacion={obtenerUsuariosDeOrganizacion}
        obtenerTodosLosUsuarios={obtenerTodosLosUsuarios}
      />
    </div>
  )
}

// Componente de formulario de organización
interface OrganizacionFormDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  organizacion: Organizacion | null
  onRefresh: () => void
  comunas: any[]
  createOrganizacion: (data: any) => Promise<Organizacion>
  updateOrganizacion: (id: number, data: any) => Promise<Organizacion>
}

function OrganizacionFormDialog({
  isOpen,
  setIsOpen,
  organizacion,
  onRefresh,
  comunas,
  createOrganizacion,
  updateOrganizacion
}: OrganizacionFormDialogProps) {
  const [formData, setFormData] = React.useState({
    nombre: '',
    nombreContacto: '',
    telefonoContacto: '',
    emailContacto: '',
    direccion: '',
    comunaId: '',
    usuariosId: [] as number[]
  })
  const [loading, setLoading] = React.useState(false)

  // Inicializar formulario cuando se abre
  React.useEffect(() => {
    if (organizacion) {
      setFormData({
        nombre: organizacion.nombre,
        nombreContacto: organizacion.nombreContacto,
        telefonoContacto: organizacion.telefonoContacto,
        emailContacto: organizacion.emailContacto,
        direccion: organizacion.direccion,
        comunaId: organizacion.comuna?.comunaId?.toString() || '',
        usuariosId: organizacion.usuariosId || []
      })
    } else {
      setFormData({
        nombre: '',
        nombreContacto: '',
        telefonoContacto: '',
        emailContacto: '',
        direccion: '',
        comunaId: '',
        usuariosId: []
      })
    }
  }, [organizacion, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        comunaId: formData.comunaId ? parseInt(formData.comunaId) : null
      }

      if (organizacion) {
        await updateOrganizacion(organizacion.organizacionId, submitData)
        toast.success('Organización actualizada exitosamente')
      } else {
        await createOrganizacion(submitData)
        toast.success('Organización creada exitosamente')
      }

      setIsOpen(false)
      onRefresh()
    } catch (error) {
      console.error('Error al guardar organización:', error)
      toast.error('Ocurrió un error al guardar la organización')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {organizacion ? 'Editar Organización' : 'Nueva Organización'}
          </DialogTitle>
          <DialogDescription>
            {organizacion 
              ? 'Modifica los datos de la organización seleccionada.'
              : 'Completa los datos para crear una nueva organización.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Organización *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreContacto">Nombre de Contacto *</Label>
              <Input
                id="nombreContacto"
                value={formData.nombreContacto}
                onChange={(e) => setFormData(prev => ({ ...prev, nombreContacto: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefonoContacto">Teléfono de Contacto *</Label>
              <Input
                id="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={(e) => setFormData(prev => ({ ...prev, telefonoContacto: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailContacto">Email de Contacto *</Label>
              <Input
                id="emailContacto"
                type="email"
                value={formData.emailContacto}
                onChange={(e) => setFormData(prev => ({ ...prev, emailContacto: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comuna">Comuna</Label>
            <Select
              value={formData.comunaId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, comunaId: value }))}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (organizacion ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Componente de confirmación de eliminación
interface DeleteConfirmationDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  organizacionName?: string
  onConfirm: () => void
}

function DeleteConfirmationDialog({
  isOpen,
  setIsOpen,
  organizacionName,
  onConfirm
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la organización "{organizacionName}".
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Componente de detalles de organización
interface OrganizacionDetailsDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  organizacion: Organizacion | null
}

function OrganizacionDetailsDialog({
  isOpen,
  setIsOpen,
  organizacion
}: OrganizacionDetailsDialogProps) {
  if (!organizacion) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Organización</DialogTitle>
          <DialogDescription>
            Información completa de la organización seleccionada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {organizacion.nombre.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{organizacion.nombre}</h3>
              <p className="text-muted-foreground">{organizacion.emailContacto}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Contacto</Label>
              <p className="mt-1">{organizacion.nombreContacto}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
              <p className="mt-1">{organizacion.telefonoContacto}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="mt-1">{organizacion.emailContacto}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Comuna</Label>
              <p className="mt-1">{organizacion.comuna?.nombre || 'Sin comuna'}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
            <p className="mt-1">{organizacion.direccion || 'Sin dirección'}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Usuarios Asociados</Label>
            <div className="mt-2">
              <Badge variant="outline">
                {organizacion.usuariosId.length} usuarios
              </Badge>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
            <div className="mt-1">
              <Badge variant={organizacion.fechaEliminacion ? "destructive" : "secondary"}>
                {organizacion.fechaEliminacion ? "Eliminada" : "Activa"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente para gestionar usuarios de una organización
interface GestionarUsuariosDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  organizacion: Organizacion | null
  agregarUsuarioAOrganizacion: (organizacionId: number, usuarioId: number) => Promise<void>
  removerUsuarioDeOrganizacion: (organizacionId: number, usuarioId: number) => Promise<void>
  obtenerUsuariosDeOrganizacion: (organizacionId: number) => Promise<Usuario[]>
  obtenerTodosLosUsuarios: () => Promise<Usuario[]>
}

function GestionarUsuariosDialog({
  isOpen,
  setIsOpen,
  organizacion,
  agregarUsuarioAOrganizacion,
  removerUsuarioDeOrganizacion,
  obtenerUsuariosDeOrganizacion,
  obtenerTodosLosUsuarios
}: GestionarUsuariosDialogProps) {
  const [usuariosOrganizacion, setUsuariosOrganizacion] = React.useState<Usuario[]>([])
  const [todosLosUsuarios, setTodosLosUsuarios] = React.useState<Usuario[]>([])
  const [loading, setLoading] = React.useState(false)
  const [addingUser, setAddingUser] = React.useState(false)
  const [removingUserId, setRemovingUserId] = React.useState<number | null>(null)
  const [selectedUsuarioId, setSelectedUsuarioId] = React.useState<string>('')

  // Cargar usuarios cuando se abre el diálogo
  React.useEffect(() => {
    if (isOpen && organizacion) {
      loadUsuarios()
    }
  }, [isOpen, organizacion])

  const loadUsuarios = async () => {
    if (!organizacion) return
    
    setLoading(true)
    try {
      const [usuariosOrg, todosUsuarios] = await Promise.all([
        obtenerUsuariosDeOrganizacion(organizacion.organizacionId),
        obtenerTodosLosUsuarios()
      ])
      setUsuariosOrganizacion(usuariosOrg)
      setTodosLosUsuarios(todosUsuarios)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      toast.error('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarUsuario = async () => {
    if (!organizacion || !selectedUsuarioId) return

    setAddingUser(true)
    try {
      await agregarUsuarioAOrganizacion(organizacion.organizacionId, parseInt(selectedUsuarioId))
      toast.success('Usuario agregado exitosamente')
      setSelectedUsuarioId('')
      loadUsuarios() // Recargar la lista
    } catch (error) {
      console.error('Error agregando usuario:', error)
      toast.error('Error al agregar el usuario')
    } finally {
      setAddingUser(false)
    }
  }

  const handleRemoverUsuario = async (usuarioId: number) => {
    if (!organizacion) return

    setRemovingUserId(usuarioId)
    try {
      await removerUsuarioDeOrganizacion(organizacion.organizacionId, usuarioId)
      toast.success('Usuario removido exitosamente')
      loadUsuarios() // Recargar la lista
    } catch (error) {
      console.error('Error removiendo usuario:', error)
      toast.error('Error al remover el usuario')
    } finally {
      setRemovingUserId(null)
    }
  }

  // Filtrar usuarios que no están en la organización
  const usuariosDisponibles = todosLosUsuarios.filter(
    usuario => !usuariosOrganizacion.some(u => u.usuarioId === usuario.usuarioId)
  )

  if (!organizacion) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestionar Usuarios - {organizacion.nombre}</DialogTitle>
          <DialogDescription>
            Agrega o remueve usuarios de esta organización.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Agregar usuario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agregar Usuario</h3>
            <div className="flex gap-2">
              <Select value={selectedUsuarioId} onValueChange={setSelectedUsuarioId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuariosDisponibles.map((usuario) => (
                    <SelectItem key={usuario.usuarioId} value={usuario.usuarioId.toString()}>
                      {usuario.nombres} {usuario.apellidos} ({usuario.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAgregarUsuario}
                disabled={!selectedUsuarioId || loading || addingUser}
              >
                {addingUser ? 'Agregando...' : 'Agregar'}
              </Button>
            </div>
          </div>

          {/* Lista de usuarios actuales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Usuarios de la Organización</h3>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : usuariosOrganizacion.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay usuarios en esta organización.
              </p>
            ) : (
              <div className="space-y-2">
                {usuariosOrganizacion.map((usuario) => (
                  <div key={usuario.usuarioId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {usuario.nombres?.substring(0, 1)}{usuario.apellidos?.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {usuario.username} • {usuario.rol}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoverUsuario(usuario.usuarioId)}
                      disabled={loading || addingUser || removingUserId === usuario.usuarioId}
                    >
                      {removingUserId === usuario.usuarioId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}