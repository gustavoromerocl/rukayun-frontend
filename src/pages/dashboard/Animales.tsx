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
        fotoUrl: "https://placedog.net/500/500?id=1",
        especie: "Perro",
        sexo: "Macho",
        tamano: "Grande",
        peso: "28.5 kg",
        fechaNacimiento: "2022-01-15",
        publicado: true,
      },
      {
        id: "3u1reuv4",
        nombre: "Luna",
        fotoUrl: "https://placedog.net/500/500?id=2",
        especie: "Gato",
        sexo: "Hembra",
        tamano: "Pequeño",
        peso: "4.2 kg",
        fechaNacimiento: "2023-03-20",
        publicado: true,
      },
      {
        id: "derv1ws0",
        nombre: "Rocky",
        fotoUrl: "https://placedog.net/500/500?id=3",
        especie: "Perro",
        sexo: "Macho",
        tamano: "Mediano",
        peso: "22 kg",
        fechaNacimiento: "2021-07-10",
        publicado: false,
      },
      {
        id: "5kma53ae",
        nombre: "Bella",
        fotoUrl: "https://placedog.net/500/500?id=4",
        especie: "Perro",
        sexo: "Hembra",
        tamano: "Pequeño",
        peso: "8 kg",
        fechaNacimiento: "2023-11-01",
        publicado: true,
      },
      {
        id: "bhqecj4p",
        nombre: "Charlie",
        fotoUrl: "https://placedog.net/500/500?id=5",
        especie: "Gato",
        sexo: "Macho",
        tamano: "Mediano",
        peso: "5.5 kg",
        fechaNacimiento: "2020-05-25",
        publicado: true,
      },
]

export type Animal = {
  id: string
  nombre: string
  fotoUrl: string
  especie: string
  sexo: "Macho" | "Hembra"
  tamano: string
  peso: string
  fechaNacimiento: string
  publicado: boolean
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
    accessorKey: "sexo",
    header: "Sexo",
  },
  {
    accessorKey: "tamano",
    header: "Tamaño",
  },
  {
    accessorKey: "peso",
    header: "Peso",
  },
  {
    accessorKey: "fechaNacimiento",
    header: "Nacimiento",
  },
  {
    accessorKey: "publicado",
    header: "Publicado",
    cell: ({ row }) => (row.original.publicado ? "Sí" : "No"),
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
        sexo: 'Macho',
        tamano: '',
        peso: '',
        fechaNacimiento: '',
        publicado: true,
    })

    React.useEffect(() => {
        if (animal) {
            setFormData({
                nombre: animal.nombre,
                especie: animal.especie,
                sexo: animal.sexo,
                tamano: animal.tamano,
                peso: animal.peso,
                fechaNacimiento: animal.fechaNacimiento,
                publicado: animal.publicado,
            })
        } else {
            // Reset form for new animal
            setFormData({
                nombre: '',
                especie: '',
                sexo: 'Macho',
                tamano: '',
                peso: '',
                fechaNacimiento: '',
                publicado: true,
            })
        }
    }, [animal, isOpen])


    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }))
    }

    const handleSelectChange = (id: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleCheckedChange = (id: string) => (checked: boolean) => {
        setFormData(prev => ({ ...prev, [id]: checked }))
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
                        <Label htmlFor="sexo" className="text-right">Sexo</Label>
                        <Select value={formData.sexo} onValueChange={handleSelectChange('sexo')}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona el sexo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Macho">Macho</SelectItem>
                                <SelectItem value="Hembra">Hembra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tamano" className="text-right">Tamaño</Label>
                        <Input id="tamano" value={formData.tamano} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="peso" className="text-right">Peso</Label>
                        <Input id="peso" value={formData.peso} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fechaNacimiento" className="text-right">Fecha Nacimiento</Label>
                        <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleValueChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="publicado" className="text-right">Publicado</Label>
                        <Checkbox id="publicado" checked={formData.publicado} onCheckedChange={handleCheckedChange('publicado')} />
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
                    <p className="font-semibold text-right">Sexo:</p>
                    <p>{animal.sexo}</p>
                    <p className="font-semibold text-right">Tamaño:</p>
                    <p>{animal.tamano}</p>
                    <p className="font-semibold text-right">Peso:</p>
                    <p>{animal.peso}</p>
                    <p className="font-semibold text-right">Fecha Nacimiento:</p>
                    <p>{animal.fechaNacimiento}</p>
                    <p className="font-semibold text-right">Publicado:</p>
                    <p>{animal.publicado ? 'Sí' : 'No'}</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 