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
import { MoreHorizontal } from "lucide-react"

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
    accessorKey: "animal",
    header: "Animal",
  },
  {
    accessorKey: "adoptante",
    header: "Adoptante",
  },
  {
    accessorKey: "tipo",
    header: "Tipo de Seguimiento",
  },
  {
    accessorKey: "fechaProxima",
    header: "Próxima Interacción",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
        const estado = row.getValue("estado") as string
        
        const getBadgeVariant = (estado: Seguimiento['estado']): "secondary" | "outline" => {
            switch (estado) {
                case "Activo":
                    return "secondary";
                case "Cerrado":
                    return "outline";
                default:
                    return "outline";
            }
        }

        return <Badge variant={getBadgeVariant(row.original.estado)}>{estado}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
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
            <DropdownMenuItem
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleViewHistory(row.original)
                }}
            >
                Ver Historial
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleRegisterInteraction(row.original)
                }}
            >
                Registrar Interacción
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleFinishFollowUp(row.original)
                }}
            >
                Finalizar Seguimiento
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

  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filtrar por adoptante..."
            value={(table.getColumn("adoptante")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("adoptante")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
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
    if (!seguimiento) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar Interacción</DialogTitle>
                    <DialogDescription>
                        Seguimiento para {seguimiento.animal}, adoptado por {seguimiento.adoptante}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right">Tipo</Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Llamada Telefónica">Llamada Telefónica</SelectItem>
                                <SelectItem value="Visita Domiciliaria">Visita Domiciliaria</SelectItem>
                                <SelectItem value="Correo Electrónico">Correo Electrónico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fecha" className="text-right">Fecha</Label>
                        <Input id="fecha" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="observaciones" className="text-right">Observaciones</Label>
                        <Textarea id="observaciones" placeholder="Añade tus observaciones aquí..." className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button type="submit">Guardar Interacción</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function HistorialDialog({
    isOpen,
    setIsOpen,
    seguimiento,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    seguimiento: Seguimiento | null
    }) {
    if (!seguimiento) return null;

    // Datos de ejemplo para el historial
    const historial = [
        { fecha: '2024-05-15', tipo: 'Llamada Telefónica', observacion: 'El adoptante reporta que Max se está adaptando bien.' },
        { fecha: '2024-04-10', tipo: 'Visita Domiciliaria', observacion: 'Se observó un ambiente adecuado y seguro para el animal.' },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Historial de Seguimiento</DialogTitle>
                    <DialogDescription>
                        Historial para {seguimiento.animal}, adoptado por {seguimiento.adoptante}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {historial.map((item, index) => (
                        <div key={index} className="border-l-2 pl-4">
                            <p className="font-semibold">{item.tipo} - <span className="font-normal text-sm text-muted-foreground">{item.fecha}</span></p>
                            <p className="text-sm">{item.observacion}</p>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
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
    if (!seguimiento) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de finalizar este seguimiento?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción marcará el seguimiento de {seguimiento.animal} como "Cerrado" y no se podrá revertir.
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