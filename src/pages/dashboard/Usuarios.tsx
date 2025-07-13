import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, CheckCircle, XCircle, MoreHorizontal, Users, Search } from "lucide-react"
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
import { useUsuarios } from "@/hooks/useUsuarios"
import { UsuariosService } from "@/services/usuariosService"
import { useApi } from "@/hooks/useApi"
import { toast } from "sonner"
import { useComunas } from "@/hooks/useComunas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function getInitials(nombres: string, apellidos: string) {
  const nombre = nombres?.split(" ")[0] || ""
  const apellido = apellidos?.split(" ")[1] || apellidos?.split(" ")[0] || ""
  return `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase()
}

export default function UsuariosOrgPage() {
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<any | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [deactivateUser, setDeactivateUser] = useState<any | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addData, setAddData] = useState<any>({ nombres: '', apellidos: '', telefono: '', email: '', comunaId: '', direccion: '', activo: true })
  const { comunas } = useComunas();
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});
  const [addErrors, setAddErrors] = useState<{[key: string]: string}>({});

  // Hook real de usuarios
  const apiClient = useApi();
  const { usuarios, loading, error, fetchUsuarios } = useUsuarios()

  const filtered = usuarios.filter(u =>
    (u.nombres?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.apellidos?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || u.username?.toLowerCase() || "").includes(search.toLowerCase())
  )

  const handleEdit = (usuario: any) => {
    setEditUser(usuario)
    setEditData({
      ...usuario,
      email: usuario.email || usuario.username || '',
      comunaId: usuario.comuna?.comunaId ?? ''
    })
  }

  const handleEditSave = async () => {
    if (!editUser) return;
    
    // Validar formulario antes de enviar
    if (!validateEditForm()) {
      toast.error('Por favor, completa todos los campos obligatorios')
      return
    }

    setEditLoading(true);
    try {
      const usuariosService = new UsuariosService(apiClient);
      const dataToSend = {
        username: editData.email || editData.username,
        nombres: editData.nombres,
        apellidos: editData.apellidos,
        activo: editData.activo,
        direccion: editData.direccion || '',
        telefono: editData.telefono || '',
        telefono2: editData.telefono2 || null,
        comunaId: editData.comunaId ? parseInt(editData.comunaId) : undefined,
        email: editData.email,
      };
      await usuariosService.actualizarUsuario(editUser.usuarioId, dataToSend);
      toast.success('Usuario actualizado exitosamente');
      setEditUser(null);
      setEditData({});
      setEditErrors({});
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error actualizando usuario:', error)
      
      // Parsear el error del backend para mostrar el detail en toaster
      if (error.response?.status === 400 && error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Error al actualizar usuario')
      }
    } finally {
      setEditLoading(false);
    }
  }

  const handleEditCancel = () => {
    setEditUser(null)
    setEditData({})
    setEditErrors({})
  }

  const validateEditForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!editData.nombres?.trim()) {
      errors.nombres = 'Los nombres son obligatorios'
    }
    
    if (!editData.apellidos?.trim()) {
      errors.apellidos = 'Los apellidos son obligatorios'
    }
    
    if (!editData.email?.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errors.email = 'El formato del email no es válido'
    }
    
    if (!editData.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio'
    }
    
    if (!editData.direccion?.trim()) {
      errors.direccion = 'La dirección es obligatoria'
    }
    
    if (!editData.comunaId) {
      errors.comunaId = 'La comuna es obligatoria'
    }
    
    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddSave = async () => {
    // Validar formulario antes de enviar
    if (!validateAddForm()) {
      toast.error('Por favor, completa todos los campos obligatorios')
      return
    }

    setAddLoading(true);
    try {
      const usuariosService = new UsuariosService(apiClient);
      const dataToSend = {
        username: addData.email,
        nombres: addData.nombres,
        apellidos: addData.apellidos,
        activo: true,
        direccion: addData.direccion || '',
        telefono: addData.telefono || '',
        telefono2: addData.telefono2 || null,
        comunaId: addData.comunaId ? parseInt(addData.comunaId) : undefined,
        email: addData.email,
      };
      await usuariosService.crearUsuario(dataToSend);
      toast.success('Usuario creado exitosamente');
      setAddOpen(false);
      setAddData({ nombres: '', apellidos: '', telefono: '', email: '', comunaId: '', direccion: '', activo: true });
      setAddErrors({});
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error creando usuario:', error)
      
      // Parsear el error del backend para mostrar el detail en toaster
      if (error.response?.status === 400 && error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Error al crear usuario')
      }
    } finally {
      setAddLoading(false);
    }
  }

  const clearAddForm = () => {
    setAddData({ nombres: '', apellidos: '', telefono: '', email: '', comunaId: '', direccion: '', activo: true });
    setAddErrors({});
  }

  const validateAddForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!addData.nombres?.trim()) {
      errors.nombres = 'Los nombres son obligatorios'
    }
    
    if (!addData.apellidos?.trim()) {
      errors.apellidos = 'Los apellidos son obligatorios'
    }
    
    if (!addData.email?.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addData.email)) {
      errors.email = 'El formato del email no es válido'
    }
    
    if (!addData.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio'
    }
    
    if (!addData.direccion?.trim()) {
      errors.direccion = 'La dirección es obligatoria'
    }
    
    if (!addData.comunaId) {
      errors.comunaId = 'La comuna es obligatoria'
    }
    
    setAddErrors(errors)
    return Object.keys(errors).length === 0
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" />Usuarios de la organización</h2>
          <p className="text-muted-foreground">Administra los usuarios que pertenecen a tu organización.</p>
        </div>
        <Button onClick={() => {
          clearAddForm();
          setAddOpen(true);
        }} className="w-full sm:w-auto">
          <Users className="mr-2 h-4 w-4" /> Añadir usuario
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, apellido o email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* Loading y error */}
          {loading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 py-4">
              Error al cargar los usuarios: {error}
              <Button onClick={fetchUsuarios} className="ml-4">Reintentar</Button>
            </div>
          )}
          {/* Vista de tabla para escritorio */}
          {!loading && !error && (
            <table className="min-w-full text-sm hidden md:table">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-left">Avatar</th>
                  <th className="py-2 px-3 text-left">Nombre</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Teléfono</th>
                  <th className="py-2 px-3 text-left">Comuna</th>
                  <th className="py-2 px-3 text-left">Estado</th>
                  <th className="py-2 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(usuario => (
                  <tr key={usuario.usuarioId} className="border-b">
                    <td className="py-2 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(usuario.nombres, usuario.apellidos)}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="py-2 px-3 font-medium">
                      {usuario.nombres} {usuario.apellidos}
                    </td>
                    <td className="py-2 px-3">{usuario.email || usuario.username}</td>
                    <td className="py-2 px-3">{usuario.telefono || '-'}</td>
                    <td className="py-2 px-3">{usuario.comuna?.nombre || '-'}</td>
                    <td className="py-2 px-3">
                      {usuario.activo ? (
                        <Badge variant="secondary"><CheckCircle className="inline w-4 h-4 mr-1" />Activo</Badge>
                      ) : (
                        <Badge variant="destructive"><XCircle className="inline w-4 h-4 mr-1" />Inactivo</Badge>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                            <Edit className="mr-2 h-4 w-4" />Editar
                          </DropdownMenuItem>
                          {/* Aquí puedes agregar más acciones como desactivar, eliminar, etc. */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal de edición de usuario */}
      <Dialog open={!!editUser} onOpenChange={open => !open && handleEditCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario seleccionado.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nombres *</label>
                <Input 
                  value={editData.nombres || ''} 
                  onChange={e => {
                    setEditData((d: any) => ({ ...d, nombres: e.target.value }))
                    if (editErrors.nombres) {
                      setEditErrors(prev => ({ ...prev, nombres: '' }))
                    }
                  }} 
                  className={editErrors.nombres ? 'border-red-500' : ''}
                />
                {editErrors.nombres && (
                  <p className="text-sm text-red-500">{editErrors.nombres}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Apellidos *</label>
                <Input 
                  value={editData.apellidos || ''} 
                  onChange={e => {
                    setEditData((d: any) => ({ ...d, apellidos: e.target.value }))
                    if (editErrors.apellidos) {
                      setEditErrors(prev => ({ ...prev, apellidos: '' }))
                    }
                  }} 
                  className={editErrors.apellidos ? 'border-red-500' : ''}
                />
                {editErrors.apellidos && (
                  <p className="text-sm text-red-500">{editErrors.apellidos}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email *</label>
              <Input 
                type="email" 
                value={editData.email || ''} 
                onChange={e => {
                  setEditData((d: any) => ({ ...d, email: e.target.value }))
                  if (editErrors.email) {
                    setEditErrors(prev => ({ ...prev, email: '' }))
                  }
                }} 
                className={editErrors.email ? 'border-red-500' : ''}
              />
              {editErrors.email && (
                <p className="text-sm text-red-500">{editErrors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Teléfono *</label>
                <Input 
                  value={editData.telefono || ''} 
                  onChange={e => {
                    setEditData((d: any) => ({ ...d, telefono: e.target.value }))
                    if (editErrors.telefono) {
                      setEditErrors(prev => ({ ...prev, telefono: '' }))
                    }
                  }} 
                  className={editErrors.telefono ? 'border-red-500' : ''}
                />
                {editErrors.telefono && (
                  <p className="text-sm text-red-500">{editErrors.telefono}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Dirección *</label>
                <Input 
                  value={editData.direccion || ''} 
                  onChange={e => {
                    setEditData((d: any) => ({ ...d, direccion: e.target.value }))
                    if (editErrors.direccion) {
                      setEditErrors(prev => ({ ...prev, direccion: '' }))
                    }
                  }} 
                  className={editErrors.direccion ? 'border-red-500' : ''}
                />
                {editErrors.direccion && (
                  <p className="text-sm text-red-500">{editErrors.direccion}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Comuna *</label>
              <Select 
                value={editData.comunaId ? String(editData.comunaId) : ''} 
                onValueChange={value => {
                  setEditData((d: any) => ({ ...d, comunaId: value ? Number(value) : undefined }))
                  if (editErrors.comunaId) {
                    setEditErrors(prev => ({ ...prev, comunaId: '' }))
                  }
                }}
              >
                <SelectTrigger className={editErrors.comunaId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona una comuna" />
                </SelectTrigger>
                <SelectContent>
                  {comunas.map(comuna => (
                    <SelectItem key={comuna.comunaId} value={comuna.comunaId.toString()}>{comuna.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editErrors.comunaId && (
                <p className="text-sm text-red-500">{editErrors.comunaId}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleEditCancel}>Cancelar</Button>
              <Button type="submit" disabled={editLoading}>{editLoading ? 'Guardando...' : 'Guardar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de desactivación */}
      <AlertDialog open={!!deactivateUser} onOpenChange={open => !open && setDeactivateUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              El usuario no podrá acceder al sistema hasta que sea reactivado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setDeactivateUser(null)} className="bg-red-600 hover:bg-red-700">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de agregar usuario */}
      <Dialog open={addOpen} onOpenChange={open => {
        if (!open) {
          setAddOpen(false)
          clearAddForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir usuario</DialogTitle>
            <DialogDescription>Completa los datos para agregar un nuevo usuario.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAddSave(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nombres *</label>
                <Input 
                  value={addData.nombres} 
                  onChange={e => {
                    setAddData((d: any) => ({ ...d, nombres: e.target.value }))
                    if (addErrors.nombres) {
                      setAddErrors(prev => ({ ...prev, nombres: '' }))
                    }
                  }} 
                  className={addErrors.nombres ? 'border-red-500' : ''}
                />
                {addErrors.nombres && (
                  <p className="text-sm text-red-500">{addErrors.nombres}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Apellidos *</label>
                <Input 
                  value={addData.apellidos} 
                  onChange={e => {
                    setAddData((d: any) => ({ ...d, apellidos: e.target.value }))
                    if (addErrors.apellidos) {
                      setAddErrors(prev => ({ ...prev, apellidos: '' }))
                    }
                  }} 
                  className={addErrors.apellidos ? 'border-red-500' : ''}
                />
                {addErrors.apellidos && (
                  <p className="text-sm text-red-500">{addErrors.apellidos}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email *</label>
              <Input 
                type="email" 
                value={addData.email} 
                onChange={e => {
                  setAddData((d: any) => ({ ...d, email: e.target.value }))
                  if (addErrors.email) {
                    setAddErrors(prev => ({ ...prev, email: '' }))
                  }
                }} 
                className={addErrors.email ? 'border-red-500' : ''}
              />
              {addErrors.email && (
                <p className="text-sm text-red-500">{addErrors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Teléfono *</label>
                <Input 
                  value={addData.telefono} 
                  onChange={e => {
                    setAddData((d: any) => ({ ...d, telefono: e.target.value }))
                    if (addErrors.telefono) {
                      setAddErrors(prev => ({ ...prev, telefono: '' }))
                    }
                  }} 
                  className={addErrors.telefono ? 'border-red-500' : ''}
                />
                {addErrors.telefono && (
                  <p className="text-sm text-red-500">{addErrors.telefono}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Dirección *</label>
                <Input 
                  value={addData.direccion} 
                  onChange={e => {
                    setAddData((d: any) => ({ ...d, direccion: e.target.value }))
                    if (addErrors.direccion) {
                      setAddErrors(prev => ({ ...prev, direccion: '' }))
                    }
                  }} 
                  className={addErrors.direccion ? 'border-red-500' : ''}
                />
                {addErrors.direccion && (
                  <p className="text-sm text-red-500">{addErrors.direccion}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Comuna *</label>
              <Select 
                value={addData.comunaId ? String(addData.comunaId) : ''} 
                onValueChange={value => {
                  setAddData((d: any) => ({ ...d, comunaId: value ? Number(value) : undefined }))
                  if (addErrors.comunaId) {
                    setAddErrors(prev => ({ ...prev, comunaId: '' }))
                  }
                }}
              >
                <SelectTrigger className={addErrors.comunaId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona una comuna" />
                </SelectTrigger>
                <SelectContent>
                  {comunas.map(comuna => (
                    <SelectItem key={comuna.comunaId} value={comuna.comunaId.toString()}>{comuna.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addErrors.comunaId && (
                <p className="text-sm text-red-500">{addErrors.comunaId}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={addLoading}>{addLoading ? 'Guardando...' : 'Guardar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 