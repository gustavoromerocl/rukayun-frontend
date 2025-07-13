"use client"

import * as React from "react"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, Search, Check, X, Eye, ThumbsUp, ThumbsDown, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAdopciones } from "@/hooks/useAdopciones"
import { useAuth } from "@/hooks/useAuth"
import { useAppStore } from "@/lib/store"
import type { Adopcion } from "@/services/adopcionesService"

// Tipos actualizados para coincidir con la API real
export type Solicitud = Adopcion

export const columns: ColumnDef<Solicitud>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "usuarioId",
    header: "Usuario ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.usuarioId}</div>
    )
  },
  {
    accessorKey: "animal",
    header: "Animal",
    cell: ({ row }) => {
      const { nombre } = row.original.animal;
      return nombre;
    }
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha",
    cell: ({ row }) => new Date(row.getValue("fechaCreacion")).toLocaleDateString('es-ES'),
  },
  {
    accessorKey: "adopcionEstado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.adopcionEstado.nombre
      const variant = {
        "Pendiente": "default" as const,
        "Aprobada": "secondary" as const,
        "Rechazada": "destructive" as const,
      }[estado] ?? "default"

      return <Badge variant={variant}>{estado}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const solicitud = row.original
      const meta = table.options.meta as any
      const isColaborator = meta.isColaborator

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta.handleViewDetails(solicitud)}>
              <Eye className="mr-2 h-4 w-4" /> Ver Detalles
            </DropdownMenuItem>
            {isColaborator && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => meta.handleApprove(solicitud)}>
                  <ThumbsUp className="mr-2 h-4 w-4" /> Aprobar
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => meta.handleReject(solicitud)}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> Rechazar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SolicitudesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedSolicitud, setSelectedSolicitud] = React.useState<Solicitud | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false)
  const [confirmationAction, setConfirmationAction] = React.useState<"Aprobar" | "Rechazar" | null>(null)
  const [solicitudToAction, setSolicitudToAction] = React.useState<Solicitud | null>(null)

  // Hooks para obtener datos y rol del usuario
  const { adopciones, loading, error, fetchAdopciones, fetchAdopcionesByUsuario, aprobarAdopcion, rechazarAdopcion } = useAdopciones()
  const { usuario } = useAuth()
  const { isColaborator } = useAppStore()

  // Cargar datos al montar el componente - SOLUCIÓN CON useRef
  const hasLoadedRef = React.useRef(false);
  const lastUserIdRef = React.useRef<number | null>(null);
  const lastIsColaboratorRef = React.useRef<boolean | null>(null);
  
  React.useEffect(() => {
    const currentUserId = usuario?.usuarioId || null;
    const currentIsColaborator = isColaborator;
    
    // Verificar si han cambiado el usuario o el rol
    const userChanged = lastUserIdRef.current !== currentUserId;
    const roleChanged = lastIsColaboratorRef.current !== currentIsColaborator;
    
    console.log('🔄 useEffect ejecutándose', {
      currentUserId,
      currentIsColaborator,
      lastUserId: lastUserIdRef.current,
      lastIsColaborator: lastIsColaboratorRef.current,
      userChanged,
      roleChanged,
      hasLoaded: hasLoadedRef.current
    });
    
    // Si cambió el usuario o el rol, resetear el flag
    if (userChanged || roleChanged) {
      console.log('🔄 Usuario o rol cambiado, reseteando hasLoadedRef');
      hasLoadedRef.current = false;
      lastUserIdRef.current = currentUserId;
      lastIsColaboratorRef.current = currentIsColaborator;
    }
    
    // Evitar múltiples llamadas para el mismo usuario/rol
    if (hasLoadedRef.current) {
      console.log('🔄 useEffect ya ejecutado para este usuario/rol, evitando llamada duplicada');
      return;
    }
    
    console.log('🔄 useEffect ejecutándose por primera vez para este usuario/rol');
    
    // Usar una función interna para evitar dependencias problemáticas
    const loadData = () => {
      if (isColaborator) {
        console.log('📡 Cargando todas las solicitudes (colaborador)');
        // Colaboradores ven todas las solicitudes
        fetchAdopciones()
      } else if (usuario?.usuarioId) {
        console.log('📡 Cargando solicitudes del usuario:', usuario.usuarioId);
        // Usuarios adoptantes ven solo sus solicitudes
        fetchAdopcionesByUsuario(usuario.usuarioId)
      }
    }

    loadData()
    hasLoadedRef.current = true;
    console.log('✅ useEffect completado, hasLoadedRef establecido en true');
  }, [isColaborator, usuario?.usuarioId, fetchAdopciones, fetchAdopcionesByUsuario]) // Incluir las funciones en las dependencias

  const handleViewDetails = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setIsDetailsOpen(true)
  }

  const handleApprove = (solicitud: Solicitud) => {
    setSolicitudToAction(solicitud)
    setConfirmationAction("Aprobar")
    setIsConfirmationOpen(true)
  }

  const handleReject = (solicitud: Solicitud) => {
    setSolicitudToAction(solicitud)
    setConfirmationAction("Rechazar")
    setIsConfirmationOpen(true)
  }

  const table = useReactTable({
    data: adopciones,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      handleViewDetails,
      handleApprove,
      handleReject,
      isColaborator,
    }
  })

  const stats = {
    pendientes: adopciones.filter(s => s.adopcionEstado.nombre === 'Pendiente').length,
    aprobadas: adopciones.filter(s => s.adopcionEstado.nombre === 'Aprobada').length,
    rechazadas: adopciones.filter(s => s.adopcionEstado.nombre === 'Rechazada').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {isColaborator ? "Solicitudes de Adopción" : "Mis Solicitudes"}
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
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
          <h2 className="text-3xl font-bold tracking-tight">
            {isColaborator ? "Solicitudes de Adopción" : "Mis Solicitudes"}
          </h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error al cargar las solicitudes: {error}</p>
              <Button onClick={() => {
                if (isColaborator) {
                  fetchAdopciones()
                } else if (usuario?.usuarioId) {
                  fetchAdopcionesByUsuario(usuario.usuarioId)
                }
              }} className="mt-4">
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {isColaborator ? "Solicitudes de Adopción" : "Mis Solicitudes"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isColaborator 
            ? "Revisa y gestiona las solicitudes de los futuros adoptantes."
            : "Revisa el estado de tus solicitudes de adopción."
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aprobadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rechazadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isColaborator ? "Todas las Solicitudes" : "Mis Solicitudes"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={isColaborator ? "Buscar por solicitante o animal..." : "Buscar por animal..."}
                onChange={(event) => {
                  const value = event.target.value
                  table.setGlobalFilter(value)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Vista de Tabla para Desktop */}
          <div className="hidden md:block">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No se encontraron solicitudes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Vista móvil */}
          <div className="md:hidden space-y-3">
            {table.getRowModel().rows.map((row) => {
              const { usuarioId, animal, fechaCreacion, adopcionEstado } = row.original
              const actionsCell = row.getVisibleCells().find(c => c.column.id === 'actions');

              return (
                <Card key={row.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{usuarioId}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        Para: <span className="font-medium text-foreground">{animal.nombre}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(fechaCreacion).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        adopcionEstado.nombre === "Pendiente" ? "default" :
                        adopcionEstado.nombre === "Aprobada" ? "secondary" :
                        adopcionEstado.nombre === "Rechazada" ? "destructive" : "default"
                      }>
                        {adopcionEstado.nombre}
                      </Badge>
                      {actionsCell && flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
             {table.getRowModel().rows?.length === 0 && (
              <div className="h-24 text-center content-center">
                No se encontraron solicitudes.
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogos */}
      <SolicitudDetailsDialog
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        solicitud={selectedSolicitud}
        isColaborator={isColaborator}
      />

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        action={confirmationAction}
        solicitud={solicitudToAction}
        aprobarAdopcion={aprobarAdopcion}
        rechazarAdopcion={rechazarAdopcion}
      />
    </div>
  );
}

function SolicitudDetailsDialog({
  isOpen,
  setIsOpen,
  solicitud,
  isColaborator,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  solicitud: Solicitud | null
  isColaborator: boolean
}) {
  if (!solicitud) return null

  const { animal, usuarioId, fechaCreacion } = solicitud

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-avatar.jpg" alt={animal.nombre} />
              <AvatarFallback>{animal.nombre.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">Solicitud de Adopción</div>
              <div className="text-sm text-muted-foreground">
                {animal.nombre} • {new Date(fechaCreacion).toLocaleDateString('es-ES')}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Información del Animal</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Nombre:</strong> {animal.nombre}</div>
                <div><strong>Edad:</strong> {animal.edad} años</div>
                <div><strong>Peso:</strong> {animal.peso} kg</div>
                <div><strong>Descripción:</strong> {animal.descripcion}</div>
              </div>
            </div>

            {isColaborator && (
              <div>
                <h4 className="font-semibold text-lg mb-2">Información del Solicitante</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3"><User className="w-4 h-4 text-muted-foreground" /> Usuario ID: {usuarioId}</div>
                  <div className="text-muted-foreground">Información de contacto no disponible</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Descripción de la Familia</h4>
              <div className="text-sm bg-muted p-3 rounded-lg">
                {solicitud.descripcionFamilia || "No se proporcionó descripción de la familia."}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Estado de la Solicitud</h4>
              <Badge variant={
                solicitud.adopcionEstado.nombre === "Pendiente" ? "default" :
                solicitud.adopcionEstado.nombre === "Aprobada" ? "secondary" :
                solicitud.adopcionEstado.nombre === "Rechazada" ? "destructive" : "default"
              }>
                {solicitud.adopcionEstado.nombre}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmationDialog({
    isOpen,
    setIsOpen,
    action,
    solicitud,
    aprobarAdopcion,
    rechazarAdopcion,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    action: "Aprobar" | "Rechazar" | null
    solicitud: Solicitud | null
    aprobarAdopcion: (id: number) => Promise<any>
    rechazarAdopcion: (id: number) => Promise<any>
    }) {
    
    if (!solicitud || !action) return null

    const isApproving = action === "Aprobar"
    
    const title = `¿Seguro que quieres ${action.toLowerCase()} la solicitud?`
    const description = `Se notificará al solicitante, ${solicitud.usuarioId}, sobre la decisión para la adopción de ${solicitud.animal.nombre}.`

    const handleConfirm = async () => {
        try {
            if (action === "Aprobar") {
                await aprobarAdopcion(solicitud.adopcionId);
            } else if (action === "Rechazar") {
                await rechazarAdopcion(solicitud.adopcionId);
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Error al procesar la acción:', error);
            // El error ya está manejado en el hook
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                        className={isApproving ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 