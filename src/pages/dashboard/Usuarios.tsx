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

// Mock de usuarios basado en el modelo de datos
const mockUsuarios = [
  {
    usuarioid: 1,
    username: "admin.org@demo.com",
    nombres: "Ana María",
    apellidos: "Pérez Gómez",
    email: "admin.org@demo.com",
    activo: true,
    fechaCreacion: "2023-01-10",
    rol: "Administrador",
    telefono: "+593991234567",
    telefono2: "",
    comuna: "Centro",
  },
  {
    usuarioid: 2,
    username: "carlos.rios@demo.com",
    nombres: "Carlos",
    apellidos: "Ríos Torres",
    email: "carlos.rios@demo.com",
    activo: true,
    fechaCreacion: "2023-02-15",
    rol: "Voluntario",
    telefono: "+593987654321",
    telefono2: "",
    comuna: "Norte",
  },
  {
    usuarioid: 3,
    username: "lucia.mora@demo.com",
    nombres: "Lucía",
    apellidos: "Mora Castillo",
    email: "lucia.mora@demo.com",
    activo: false,
    fechaCreacion: "2023-03-20",
    rol: "Voluntario",
    telefono: "+593912345678",
    telefono2: "",
    comuna: "Sur",
  },
]

type Usuario = typeof mockUsuarios[number]

function getInitials(nombres: string, apellidos: string) {
  const nombre = nombres.split(" ")[0] || ""
  const apellido = apellidos.split(" ")[1] || apellidos.split(" ")[0] || ""
  return `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase()
}

export default function UsuariosOrgPage() {
  console.log('UsuariosOrgPage - Componente renderizado');
  
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [search, setSearch] = useState("")
  const [editUser, setEditUser] = useState<Usuario | null>(null)
  const [editData, setEditData] = useState<Partial<Usuario>>({})
  const [deactivateUser, setDeactivateUser] = useState<Usuario | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addData, setAddData] = useState<Partial<Usuario>>({ nombres: '', apellidos: '', telefono: '', email: '', comuna: '', rol: 'Voluntario', activo: true })

  const filtered = usuarios.filter(u =>
    u.nombres.toLowerCase().includes(search.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (usuario: Usuario) => {
    setEditUser(usuario)
    setEditData(usuario)
  }

  const handleEditSave = () => {
    setUsuarios(us => us.map(u => u.usuarioid === editUser?.usuarioid ? { ...u, ...editData } as Usuario : u))
    setEditUser(null)
    setEditData({})
  }

  const handleEditCancel = () => {
    setEditUser(null)
    setEditData({})
  }

  const handleDeactivate = (usuario: Usuario) => {
    setDeactivateUser(usuario)
  }

  const confirmDeactivate = () => {
    if (deactivateUser) {
      setUsuarios(us => us.map(u => u.usuarioid === deactivateUser.usuarioid ? { ...u, activo: false } : u))
      setDeactivateUser(null)
    }
  }

  const handleReactivate = (usuario: Usuario) => {
    setUsuarios(us => us.map(u => u.usuarioid === usuario.usuarioid ? { ...u, activo: true } : u))
  }

  const handleAdd = () => {
    setAddOpen(true)
    setAddData({ nombres: '', apellidos: '', telefono: '', email: '', comuna: '', rol: 'Voluntario', activo: true })
  }

  const handleAddSave = () => {
    setUsuarios(us => [
      ...us,
      {
        usuarioid: Math.max(...us.map(u => u.usuarioid)) + 1,
        username: addData.email || '',
        nombres: addData.nombres || '',
        apellidos: addData.apellidos || '',
        email: addData.email || '',
        activo: true,
        fechaCreacion: new Date().toISOString().slice(0, 10),
        rol: addData.rol || 'Voluntario',
        telefono: addData.telefono || '',
        telefono2: '',
        comuna: addData.comuna || '',
      }
    ])
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
        <Button onClick={handleAdd} className="w-full sm:w-auto">
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
          {/* Vista de tabla para escritorio */}
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
                <tr key={usuario.usuarioid} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(usuario.nombres, usuario.apellidos)}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="py-2 px-3 font-medium">
                    {usuario.nombres}
                    <br />
                    <span className="text-muted-foreground text-xs">{usuario.apellidos}</span>
                  </td>
                  <td className="py-2 px-3">{usuario.email}</td>
                  <td className="py-2 px-3">{usuario.telefono}</td>
                  <td className="py-2 px-3">{usuario.comuna}</td>
                  <td className="py-2 px-3">{usuario.rol}</td>
                  <td className="py-2 px-3">
                    <Badge variant={usuario.activo ? "secondary" : "destructive"}>
                      {usuario.activo ? (
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-600" />Activo</span>
                      ) : (
                        <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-600" />Inactivo</span>
                      )}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        {usuario.activo ? (
                          <DropdownMenuItem onClick={() => handleDeactivate(usuario)}>
                            <XCircle className="w-4 h-4 mr-2 text-red-600" /> Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleReactivate(usuario)}>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Reactivar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted-foreground">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Vista de tarjetas para móvil */}
          <div className="md:hidden space-y-3">
            {filtered.map(usuario => (
              <Card key={usuario.usuarioid} className="w-full">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(usuario.nombres, usuario.apellidos)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{usuario.nombres} <span className="text-muted-foreground text-xs font-normal">{usuario.apellidos}</span></div>
                    <div className="text-xs text-muted-foreground truncate">{usuario.email}</div>
                    <div className="text-xs text-muted-foreground">{usuario.rol} - {usuario.comuna}</div>
                    <Badge variant={usuario.activo ? "secondary" : "destructive"} className="mt-1">
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      {usuario.activo ? (
                        <DropdownMenuItem onClick={() => handleDeactivate(usuario)}>
                          <XCircle className="w-4 h-4 mr-2 text-red-600" /> Desactivar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleReactivate(usuario)}>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Reactivar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="h-24 text-center content-center text-muted-foreground">
                No se encontraron usuarios.
              </div>
            )}
          </div>
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