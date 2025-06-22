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

const data: Solicitud[] = [
    {
        id: "adp_1",
        animal: "Max (Perro)",
        solicitante: "Olivia Martin",
        fechaSolicitud: "2024-05-10",
        estado: "Pendiente",
    },
    {
        id: "adp_2",
        animal: "Luna (Gato)",
        solicitante: "Jackson Lee",
        fechaSolicitud: "2024-05-12",
        estado: "Aprobada",
    },
    {
        id: "adp_3",
        animal: "Rocky (Perro)",
        solicitante: "Isabella Nguyen",
        fechaSolicitud: "2024-05-15",
        estado: "Rechazada",
    },
    {
        id: "adp_4",
        animal: "Bella (Perro)",
        solicitante: "William Kim",
        fechaSolicitud: "2024-05-18",
        estado: "Pendiente",
    },
]

export type Solicitud = {
  id: string
  animal: string
  solicitante: string
  fechaSolicitud: string
  estado: "Pendiente" | "Aprobada" | "Rechazada"
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
    accessorKey: "animal",
    header: "Animal",
  },
  {
    accessorKey: "solicitante",
    header: "Solicitante",
  },
  {
    accessorKey: "fechaSolicitud",
    header: "Fecha de Solicitud",
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
                meta.handleViewDetails(solicitud)
              }}
            >
              Ver Detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleApprove(solicitud)
                }}
            >
                Aprobar
            </DropdownMenuItem>
            <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleReject(solicitud)
                }}
            >
                Rechazar
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

  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filtrar por solicitante..."
            value={(table.getColumn("solicitante")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("solicitante")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
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

function SolicitudDetailsDialog({
    isOpen,
    setIsOpen,
    solicitud,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    solicitud: Solicitud | null
    }) {
    if (!solicitud) return null;

    const getBadgeVariant = (estado: Solicitud['estado']): "default" | "secondary" | "destructive" => {
        switch (estado) {
            case "Aprobada":
                return "secondary";
            case "Rechazada":
                return "destructive";
            case "Pendiente":
            default:
                return "default";
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detalles de la Solicitud</DialogTitle>
                    <DialogDescription>
                        Solicitud de {solicitud.solicitante} para adoptar a {solicitud.animal}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 py-4">
                    <p className="font-semibold text-right">Animal:</p>
                    <p>{solicitud.animal}</p>
                    <p className="font-semibold text-right">Solicitante:</p>
                    <p>{solicitud.solicitante}</p>
                    <p className="font-semibold text-right">Fecha:</p>
                    <p>{solicitud.fechaSolicitud}</p>
                    <p className="font-semibold text-right">Estado:</p>
                    <Badge variant={getBadgeVariant(solicitud.estado)}>
                        {solicitud.estado}
                    </Badge>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
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
    if (!action || !solicitud) return null;

    const title = `¿Estás seguro de que quieres ${action.toLowerCase()} esta solicitud?`;
    const description = `Esta acción cambiará el estado de la solicitud de ${solicitud.solicitante} para ${solicitud.animal}.`;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
} 