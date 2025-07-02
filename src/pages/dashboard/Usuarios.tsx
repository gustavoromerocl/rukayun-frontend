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
  const [addData, setAddData] = useState<any>({ nombres: '', apellidos: '', telefono: '', email: '', comuna: '', rol: 'Voluntario', activo: true })

  // Hook real de usuarios
  const { usuarios, loading, error, fetchUsuarios } = useUsuarios()

  const filtered = usuarios.filter(u =>
    (u.nombres?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.apellidos?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || u.username?.toLowerCase() || "").includes(search.toLowerCase())
  )

  const handleEdit = (usuario: any) => {
    setEditUser(usuario)
    setEditData(usuario)
  }

  const handleEditSave = () => {
    // Implementa la lógica para guardar los cambios en el usuario
    setEditUser(null)
    setEditData({})
  }

  const handleEditCancel = () => {
    setEditUser(null)
    setEditData({})
  }

  const handleDeactivate = (usuario: any) => {
    setDeactivateUser(usuario)
  }

  const confirmDeactivate = () => {
    if (deactivateUser) {
      // Implementa la lógica para desactivar el usuario
      setDeactivateUser(null)
    }
  }

  const handleReactivate = (usuario: any) => {
    // Implementa la lógica para reactivar el usuario
  }

  const handleAdd = () => {
    setAddOpen(true)
    setAddData({ nombres: '', apellidos: '', telefono: '', email: '', comuna: '', rol: 'Voluntario', activo: true })
  }

  const handleAddSave = () => {
    // Implementa la lógica para agregar un nuevo usuario
    setAddOpen(false)
    setAddData({ nombres: '', apellidos: '', telefono: '', email: '', comuna: '', rol: 'Voluntario', activo: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" />Usuarios de la organización</h2>
          <p className="text-muted-foreground">Administra los usuarios que pertenecen a tu organización.</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
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
                  <th className="py-2 px-3 text-left">Rol</th>
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
                      <Badge>{usuario.rol}</Badge>
                    </td>
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
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal de edición */}
      <Dialog open={!!editUser} onOpenChange={open => !open && handleEditCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario.</DialogDescription>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombres</label>
                <Input
                  value={editData.nombres || ""}
                  onChange={e => setEditData(ed => ({ ...ed, nombres: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Apellidos</label>
                <Input
                  value={editData.apellidos || ""}
                  onChange={e => setEditData(ed => ({ ...ed, apellidos: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <Input
                value={editData.telefono || ""}
                onChange={e => setEditData(ed => ({ ...ed, telefono: e.target.value }))}
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleEditCancel}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
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
            <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de agregar usuario */}
      <Dialog open={addOpen} onOpenChange={open => !open && setAddOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir usuario</DialogTitle>
            <DialogDescription>Completa los datos para agregar un nuevo usuario.</DialogDescription>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleAddSave(); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombres</label>
                <Input
                  value={addData.nombres || ""}
                  onChange={e => setAddData(ad => ({ ...ad, nombres: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Apellidos</label>
                <Input
                  value={addData.apellidos || ""}
                  onChange={e => setAddData(ad => ({ ...ad, apellidos: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <Input
                  value={addData.telefono || ""}
                  onChange={e => setAddData(ad => ({ ...ad, telefono: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={addData.email || ""}
                  onChange={e => setAddData(ad => ({ ...ad, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Comuna</label>
                <Input
                  value={addData.comuna || ""}
                  onChange={e => setAddData(ad => ({ ...ad, comuna: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <Input
                  value={addData.rol || ""}
                  onChange={e => setAddData(ad => ({ ...ad, rol: e.target.value }))}
                  required
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 