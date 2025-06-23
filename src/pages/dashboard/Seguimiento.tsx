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
import { MoreHorizontal, Search, FileText, CheckCircle2, History, PlusCircle } from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data: Seguimiento[] = [
    {
        id: "seg_1",
        animal: "Max",
        adoptante: "Olivia Martin",
        tipo: "Visita Domiciliaria",
        fechaProxima: "2024-06-15",
        estado: "Activo",
    },
    {
        id: "seg_2",
        animal: "Luna",
        adoptante: "Jackson Lee",
        tipo: "Llamada Telefónica",
        fechaProxima: "2024-06-20",
        estado: "Activo",
    },
    {
        id: "seg_3",
        animal: "Rocky",
        adoptante: "Isabella Nguyen",
        tipo: "Visita Domiciliaria",
        fechaProxima: "2024-04-10",
        estado: "Cerrado",
    },
    {
        id: "seg_4",
        animal: "Buddy",
        adoptante: "William Kim",
        tipo: "Correo Electrónico",
        fechaProxima: "2024-07-01",
        estado: "Activo",
    },
]

export type Seguimiento = {
  id: string
  animal: string
  adoptante: string
  tipo: string
  fechaProxima: string
  estado: "Activo" | "Cerrado"
}

export const columns: ColumnDef<Seguimiento>[] = [
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
    accessorKey: "adoptante",
    header: "Adoptante",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("adoptante")}</div>
    )
  },
  {
    accessorKey: "animal",
    header: "Animal",
  },
  {
    accessorKey: "tipo",
    header: "Tipo de Seguimiento",
  },
  {
    accessorKey: "fechaProxima",
    header: "Próxima Interacción",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fechaProxima"))
      return <div className="text-sm">{fecha.toLocaleDateString('es-ES')}</div>
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
        const estado = row.getValue("estado") as string
        
        return <Badge variant={estado === 'Activo' ? 'default' : 'secondary'}>{estado}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
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
            <DropdownMenuItem onClick={() => meta.handleViewHistory(row.original)}>
                <History className="mr-2 h-4 w-4" /> Ver Historial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.handleRegisterInteraction(row.original)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Interacción
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-red-600"
                onClick={() => meta.handleFinishFollowUp(row.original)}
            >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar Seguimiento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SeguimientoPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [selectedSeguimiento, setSelectedSeguimiento] = React.useState<Seguimiento | null>(null)

  const handleRegisterInteraction = (seguimiento: Seguimiento) => {
    setSelectedSeguimiento(seguimiento)
    setIsRegisterOpen(true)
  }

  const handleViewHistory = (seguimiento: Seguimiento) => {
    setSelectedSeguimiento(seguimiento)
    setIsHistoryOpen(true)
  }

  const handleFinishFollowUp = (seguimiento: Seguimiento) => {
    setSelectedSeguimiento(seguimiento)
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
        handleRegisterInteraction,
        handleViewHistory,
        handleFinishFollowUp,
    }
  })

  const totalSeguimientos = data.length
  const seguimientosActivos = data.filter(s => s.estado === 'Activo').length
  const seguimientosCerrados = data.filter(s => s.estado === 'Cerrado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Seguimiento de Adopciones
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona y registra las interacciones con los adoptantes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seguimientos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeguimientos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seguimientosActivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seguimientosCerrados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla/tarjetas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Seguimientos</CardTitle>
          <CardDescription>
            Busca y filtra los seguimientos por adoptante, animal o estado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por adoptante o animal..."
                value={(table.getColumn("adoptante")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("adoptante")?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>
            <Select
              value={(table.getColumn("estado")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("estado")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Activo">Activos</SelectItem>
                <SelectItem value="Cerrado">Cerrados</SelectItem>
              </SelectContent>
            </Select>
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
                        No se encontraron seguimientos.
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
              const { adoptante, animal, fechaProxima, estado } = row.original
              const actionsCell = row.getVisibleCells().find(c => c.column.id === 'actions');

              return (
                <Card key={row.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{adoptante}</p>
                      <p className="text-sm text-muted-foreground truncate">Animal: {animal}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Próx. contacto: {new Date(fechaProxima).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={estado === 'Activo' ? 'default' : 'secondary'}>{estado}</Badge>
                      {actionsCell && flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-end space-x-2 py-4 mt-4">
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

      <RegistrarInteraccionDialog 
        isOpen={isRegisterOpen} 
        setIsOpen={setIsRegisterOpen} 
        seguimiento={selectedSeguimiento} 
      />
      <HistorialDialog
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        seguimiento={selectedSeguimiento}
      />
      <FinalizarDialog
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        seguimiento={selectedSeguimiento}
      />
    </div>
  )
}

function RegistrarInteraccionDialog({
    isOpen,
    setIsOpen,
    seguimiento,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    seguimiento: Seguimiento | null
    }) {
    
    if (!seguimiento) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar Interacción</DialogTitle>
                    <DialogDescription>
                        Para el seguimiento de <span className="font-semibold">{seguimiento.animal}</span> con <span className="font-semibold">{seguimiento.adoptante}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="tipo-interaccion">Tipo de Interacción</Label>
                        <Select defaultValue="Llamada Telefónica">
                            <SelectTrigger id="tipo-interaccion">
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Llamada Telefónica">Llamada Telefónica</SelectItem>
                                <SelectItem value="Visita Domiciliaria">Visita Domiciliaria</SelectItem>
                                <SelectItem value="Correo Electrónico">Correo Electrónico</SelectItem>
                                <SelectItem value="Mensaje de Texto">Mensaje de Texto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fecha-proxima">Próxima Fecha de Contacto</Label>
                        <Input id="fecha-proxima" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notas">Notas</Label>
                        <Textarea id="notas" placeholder="Añade tus observaciones aquí..." rows={4} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button onClick={() => setIsOpen(false)}>Guardar Registro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const historialFalso = [
    { fecha: "2024-05-20", nota: "Llamada inicial. El adoptante informa que Max se está adaptando bien. Se programa próxima llamada." },
    { fecha: "2024-04-15", nota: "Visita domiciliaria. El entorno es adecuado y seguro. Max parece feliz." },
    { fecha: "2024-03-10", nota: "Entrega del animal. Se firman todos los documentos." },
]

function HistorialDialog({
    isOpen,
    setIsOpen,
    seguimiento,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    seguimiento: Seguimiento | null
    }) {

    if (!seguimiento) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Historial de Seguimiento</DialogTitle>
                    <DialogDescription>
                        Mostrando el historial para <span className="font-semibold">{seguimiento.animal}</span> con <span className="font-semibold">{seguimiento.adoptante}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="relative pl-6 space-y-6">
                        {/* Línea de tiempo vertical */}
                        <div className="absolute left-9 top-0 h-full w-0.5 bg-border" />

                        {historialFalso.map((item, index) => (
                            <div key={index} className="relative flex items-start">
                                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary -translate-x-1/2">
                                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="ml-12">
                                    <p className="font-semibold text-sm">{new Date(item.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-muted-foreground text-sm">{item.nota}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function FinalizarDialog({
    isOpen,
    setIsOpen,
    seguimiento,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    seguimiento: Seguimiento | null
    }) {
    
    if (!seguimiento) return null

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar seguimiento?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción marcará el seguimiento de <span className="font-semibold">{seguimiento.animal}</span> como "Cerrado".
                No podrás registrar nuevas interacciones. ¿Estás seguro?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Confirmar y Finalizar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
} 