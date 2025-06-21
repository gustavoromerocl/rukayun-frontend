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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const initialData: Animal[] = [
    {
        id: "m5gr84i9",
        nombre: "Max",
        fotoUrl: "https://placekitten.com/g/200/200",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: "2 años",
        estado: "Disponible",
      },
      {
        id: "3u1reuv4",
        nombre: "Luna",
        fotoUrl: "https://placekitten.com/g/200/201",
        especie: "Gato",
        raza: "Siamés",
        edad: "1 año",
        estado: "En proceso",
      },
      {
        id: "derv1ws0",
        nombre: "Rocky",
        fotoUrl: "https://placekitten.com/g/201/200",
        especie: "Perro",
        raza: "Pastor Alemán",
        edad: "3 años",
        estado: "Adoptado",
      },
      {
        id: "5kma53ae",
        nombre: "Bella",
        fotoUrl: "https://placekitten.com/g/200/202",
        especie: "Perro",
        raza: "Beagle",
        edad: "6 meses",
        estado: "Disponible",
      },
      {
        id: "bhqecj4p",
        nombre: "Charlie",
        fotoUrl: "https://placekitten.com/g/202/200",
        especie: "Gato",
        raza: "Persa",
        edad: "4 años",
        estado: "Disponible",
      },
]

export type Animal = {
  id: string
  nombre: string
  fotoUrl: string
  especie: string
  raza: string
  edad: string
  estado: "Disponible" | "En proceso" | "Adoptado"
}

export const columns: ColumnDef<Animal>[] = [
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
    accessorKey: "fotoUrl",
    header: "Foto",
    cell: ({ row }) => (
        <Avatar>
            <AvatarImage src={row.original.fotoUrl} alt={row.original.nombre} />
            <AvatarFallback>{row.original.nombre.substring(0, 2)}</AvatarFallback>
        </Avatar>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "especie",
    header: "Especie",
  },
  {
    accessorKey: "raza",
    header: "Raza",
  },
  {
    accessorKey: "edad",
    header: "Edad",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const animal = row.original

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
              onClick={() => navigator.clipboard.writeText(animal.id)}
            >
              Copiar ID del animal
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleViewDetails(animal)
                }}
            >
                Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleEdit(animal)
                }}
            >
                Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
                className="text-red-600"
                onClick={() => {
                    const meta = table.options.meta as any
                    meta.handleDelete(animal)
                }}
            >
                Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AnimalesPage() {
  const [data, setData] = React.useState(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [selectedAnimal, setSelectedAnimal] = React.useState<Animal | null>(null)


  const handleEdit = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsFormOpen(true)
  }

  const handleDelete = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsConfirmOpen(true)
  }

  const handleViewDetails = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsDetailsOpen(true)
  }

  const handleAddNew = () => {
    setSelectedAnimal(null)
    setIsFormOpen(true)
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
        handleEdit,
        handleDelete,
        handleViewDetails,
    }
  })

  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filtrar por nombre..."
            value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("nombre")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <Button onClick={handleAddNew}>Añadir Animal</Button>
            <AnimalFormDialog 
                isOpen={isFormOpen} 
                setIsOpen={setIsFormOpen} 
                animal={selectedAnimal} 
            />
             <DeleteConfirmationDialog
                isOpen={isConfirmOpen}
                setIsOpen={setIsConfirmOpen}
                animalName={selectedAnimal?.nombre}
            />
            <AnimalDetailsDialog
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                animal={selectedAnimal}
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

function AnimalFormDialog({
    isOpen,
    setIsOpen,
    animal,
  }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    animal: Animal | null
  }) {
    const [formData, setFormData] = React.useState<Omit<Animal, 'id' | 'fotoUrl'>>({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        estado: 'Disponible',
    })

    React.useEffect(() => {
        if (animal) {
            setFormData({
                nombre: animal.nombre,
                especie: animal.especie,
                raza: animal.raza,
                edad: animal.edad,
                estado: animal.estado,
            })
        } else {
            // Reset form for new animal
            setFormData({
                nombre: '',
                especie: '',
                raza: '',
                edad: '',
                estado: 'Disponible',
            })
        }
    }, [animal, isOpen])


    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: Animal['estado']) => {
        setFormData(prev => ({ ...prev, estado: value }))
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{animal ? 'Editar animal' : 'Añadir nuevo animal'}</DialogTitle>
                    <DialogDescription>
                        {animal ? 'Modifica los datos del animal.' : 'Rellena los campos para registrar un nuevo animal.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">Nombre</Label>
                        <Input id="nombre" value={formData.nombre} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="especie" className="text-right">Especie</Label>
                        <Input id="especie" value={formData.especie} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="raza" className="text-right">Raza</Label>
                        <Input id="raza" value={formData.raza} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edad" className="text-right">Edad</Label>
                        <Input id="edad" value={formData.edad} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estado" className="text-right">Estado</Label>
                        <Select value={formData.estado} onValueChange={handleSelectChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Disponible">Disponible</SelectItem>
                                <SelectItem value="En proceso">En proceso</SelectItem>
                                <SelectItem value="Adoptado">Adoptado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => setIsOpen(false)}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteConfirmationDialog({
    isOpen,
    setIsOpen,
    animalName,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    animalName?: string
    }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
                <span className="font-semibold">{animalName || "este animal"}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Continuar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}

function AnimalDetailsDialog({
    isOpen,
    setIsOpen,
    animal,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    animal: Animal | null
    }) {
    if (!animal) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detalles de {animal.nombre}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={animal.fotoUrl} alt={animal.nombre} className="object-cover" />
                        <AvatarFallback>{animal.nombre.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <p className="font-semibold text-right">Especie:</p>
                    <p>{animal.especie}</p>
                    <p className="font-semibold text-right">Raza:</p>
                    <p>{animal.raza}</p>
                    <p className="font-semibold text-right">Edad:</p>
                    <p>{animal.edad}</p>
                    <p className="font-semibold text-right">Estado:</p>
                    <p>{animal.estado}</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 