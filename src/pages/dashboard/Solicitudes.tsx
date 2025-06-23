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
import { MoreHorizontal, Search, Check, X, Eye, ThumbsUp, ThumbsDown, Mail, Phone, Home, User } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const data: Solicitud[] = [
    {
        id: "adp_1",
        animal: {
          nombre: "Max",
          especie: "Perro",
          fotoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face"
        },
        solicitante: {
          nombre: "Olivia Martin",
          email: "olivia.martin@example.com",
          telefono: "+1 234 567 890",
          direccion: "123 Maple St, Springfield"
        },
        fechaSolicitud: "2024-05-10",
        estado: "Pendiente",
        respuestas: [
            { pregunta: "¿Tiene experiencia previa con mascotas?", respuesta: "Sí, he tenido perros toda mi vida." },
            { pregunta: "¿Dispone de un espacio exterior (patio, jardín)?", respuesta: "Sí, tengo un patio trasero cercado." },
        ]
    },
    {
        id: "adp_2",
        animal: {
          nombre: "Luna",
          especie: "Gato",
          fotoUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b998d?w=400&h=400&fit=crop&crop=face"
        },
        solicitante: {
          nombre: "Jackson Lee",
          email: "jackson.lee@example.com",
          telefono: "+1 987 654 321",
          direccion: "456 Oak Ave, Shelbyville"
        },
        fechaSolicitud: "2024-05-12",
        estado: "Aprobada",
        respuestas: [
            { pregunta: "¿Vive solo o con más personas?", respuesta: "Vivo con mi pareja. Ambos amamos los gatos." },
            { pregunta: "¿Está dispuesto a cubrir los gastos veterinarios?", respuesta: "Absolutamente." },
        ]
    },
    {
        id: "adp_3",
        animal: {
          nombre: "Rocky",
          especie: "Perro",
          fotoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face"
        },
        solicitante: {
          nombre: "Isabella Nguyen",
          email: "isabella.nguyen@example.com",
          telefono: "+1 555 123 456",
          direccion: "789 Pine Ln, Capital City"
        },
        fechaSolicitud: "2024-05-15",
        estado: "Rechazada",
        respuestas: [
            { pregunta: "¿Cuántas horas al día pasaría la mascota sola?", respuesta: "Alrededor de 10 horas, por mi trabajo." },
        ]
    },
]

type AnimalInfo = {
  nombre: string
  especie: string
  fotoUrl: string
}

type SolicitanteInfo = {
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export type Solicitud = {
  id: string
  animal: AnimalInfo
  solicitante: SolicitanteInfo
  fechaSolicitud: string
  estado: "Pendiente" | "Aprobada" | "Rechazada"
  respuestas: { pregunta: string; respuesta: string }[]
}

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
    accessorKey: "solicitante",
    header: "Solicitante",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.solicitante.nombre}</div>
    )
  },
  {
    accessorKey: "animal",
    header: "Animal",
    cell: ({ row }) => {
      const { nombre, especie } = row.original.animal;
      return `${nombre} (${especie})`;
    }
  },
  {
    accessorKey: "fechaSolicitud",
    header: "Fecha",
    cell: ({ row }) => new Date(row.getValue("fechaSolicitud")).toLocaleDateString('es-ES'),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SolicitudesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [actionToConfirm, setActionToConfirm] = React.useState<"Aprobar" | "Rechazar" | null>(null)
  const [selectedSolicitud, setSelectedSolicitud] = React.useState<Solicitud | null>(null)

  const handleViewDetails = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setIsDetailsOpen(true)
  }

  const handleApprove = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setActionToConfirm("Aprobar")
    setIsConfirmOpen(true)
  }

  const handleReject = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setActionToConfirm("Rechazar")
    setIsConfirmOpen(true)
  }

  const table = useReactTable({
    data,
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
    }
  })

  const stats = {
    pendientes: data.filter(s => s.estado === 'Pendiente').length,
    aprobadas: data.filter(s => s.estado === 'Aprobada').length,
    rechazadas: data.filter(s => s.estado === 'Rechazada').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Solicitudes de Adopción
        </h1>
        <p className="text-muted-foreground mt-1">
          Revisa y gestiona las solicitudes de los futuros adoptantes.
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
          <CardTitle>Todas las Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por solicitante o animal..."
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
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No se encontraron solicitudes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Vista de Tarjetas para Móvil */}
          <div className="md:hidden space-y-3">
            {table.getRowModel().rows.map((row) => {
              const { solicitante, animal, fechaSolicitud, estado } = row.original
              const actionsCell = row.getVisibleCells().find(c => c.column.id === 'actions');

              return (
                <Card key={row.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{solicitante.nombre}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        Para: <span className="font-medium text-foreground">{animal.nombre}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(fechaSolicitud).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        estado === "Pendiente" ? "default" :
                        estado === "Aprobada" ? "secondary" :
                        estado === "Rechazada" ? "destructive" : "default"
                      }>
                        {estado}
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

          <div className="flex items-center justify-end space-x-2 py-4">
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
        </CardContent>
      </Card>

      <SolicitudDetailsDialog
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        solicitud={selectedSolicitud}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        action={actionToConfirm}
        solicitud={selectedSolicitud}
      />
    </div>
  )
}

function SolicitudDetailsDialog({
    isOpen,
    setIsOpen,
    solicitud,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    solicitud: Solicitud | null
    }) {

    if (!solicitud) return null

    const { animal, solicitante, fechaSolicitud, respuestas } = solicitud

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles de la Solicitud</DialogTitle>
                    <DialogDescription>
                        Revisa la información completa de la solicitud de adopción.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    {/* Columna del Animal */}
                    <div className="md:col-span-1 space-y-4">
                        <Card>
                            <CardHeader className="p-4">
                                <h3 className="font-semibold">Animal</h3>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-center">
                                <Avatar className="h-24 w-24 mx-auto">
                                    <AvatarImage src={animal.fotoUrl} alt={animal.nombre} />
                                    <AvatarFallback>{animal.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold mt-2">{animal.nombre}</p>
                                <p className="text-sm text-muted-foreground">{animal.especie}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna de Detalles y Respuestas */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Información del Solicitante</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3"><User className="w-4 h-4 text-muted-foreground" /> {solicitante.nombre}</div>
                                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground" /> {solicitante.email}</div>
                                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground" /> {solicitante.telefono}</div>
                                <div className="flex items-center gap-3"><Home className="w-4 h-4 text-muted-foreground" /> {solicitante.direccion}</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Cuestionario</h4>
                            <div className="space-y-4">
                                {respuestas.map((r, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="font-medium text-muted-foreground">{r.pregunta}</p>
                                        <p>{r.respuesta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <div className="flex-1 text-xs text-muted-foreground">
                        Solicitud recibida el {new Date(fechaSolicitud).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cerrar</Button>
                    <Button className="bg-red-600 hover:bg-red-700">Rechazar</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Aprobar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ConfirmationDialog({
    isOpen,
    setIsOpen,
    action,
    solicitud,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    action: "Aprobar" | "Rechazar" | null
    solicitud: Solicitud | null
    }) {
    
    if (!solicitud || !action) return null

    const isApproving = action === "Aprobar"
    
    const title = `¿Seguro que quieres ${action.toLowerCase()} la solicitud?`
    const description = `Se notificará al solicitante, ${solicitud.solicitante.nombre}, sobre la decisión para la adopción de ${solicitud.animal.nombre}.`

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
                        onClick={() => console.log(`${action} solicitud ${solicitud.id}`)}
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 