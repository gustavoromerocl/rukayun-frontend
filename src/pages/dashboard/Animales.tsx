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
import { MoreHorizontal, Plus, Search, Filter, PawPrint, Eye, Edit, Trash2, Columns } from "lucide-react"

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
import { ImageUpload } from "@/components/ui/image-upload"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialData: Animal[] = [
  {
    id: "1",
    nombre: "Luna",
    fotoUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b998d?w=400&h=400&fit=crop&crop=face",
    especie: "Perro",
    sexo: "Hembra",
    tamano: "Mediano",
    peso: "15 kg",
    fechaNacimiento: "2022-03-15",
    publicado: true,
  },
  {
    id: "2",
    nombre: "Max",
    fotoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face",
    especie: "Gato",
    sexo: "Macho",
    tamano: "Pequeño",
    peso: "4 kg",
    fechaNacimiento: "2021-08-22",
    publicado: true,
  },
  {
    id: "3",
    nombre: "Rocky",
    fotoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face",
    especie: "Perro",
    sexo: "Macho",
    tamano: "Grande",
    peso: "25 kg",
    fechaNacimiento: "2020-11-10",
    publicado: false,
  },
  {
    id: "4",
    nombre: "Mittens",
    fotoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face",
    especie: "Gato",
    sexo: "Hembra",
    tamano: "Pequeño",
    peso: "3.5 kg",
    fechaNacimiento: "2023-01-05",
    publicado: true,
  },
  {
    id: "5",
    nombre: "Buddy",
    fotoUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop&crop=face",
    especie: "Perro",
    sexo: "Macho",
    tamano: "Mediano",
    peso: "18 kg",
    fechaNacimiento: "2021-05-12",
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
        <div className="flex items-center">
            <Avatar className="h-12 w-12">
                <AvatarImage 
                    src={row.original.fotoUrl} 
                    alt={row.original.nombre}
                    className="object-cover"
                />
                <AvatarFallback className="text-sm font-medium">
                    {row.original.nombre.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombre")}</div>
    ),
  },
  {
    accessorKey: "especie",
    header: "Especie",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("especie")}
      </Badge>
    ),
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.getValue("sexo")}
      </Badge>
    ),
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
    header: "Fecha de Nacimiento",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fechaNacimiento"))
      return <div className="text-sm text-muted-foreground">
        {fecha.toLocaleDateString('es-ES')}
      </div>
    },
  },
  {
    accessorKey: "publicado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.getValue("publicado") ? "default" : "secondary"}>
        {row.getValue("publicado") ? "Publicado" : "Borrador"}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
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
              onClick={() => {
                const meta = table.options.meta as any
                meta.handleViewDetails(animal)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const meta = table.options.meta as any
                meta.handleEdit(animal)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                const meta = table.options.meta as any
                meta.handleDelete(animal)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AnimalesPage() {
  const [data] = React.useState<Animal[]>(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      // Ocultar columnas menos importantes en pantallas pequeñas
      peso: false,
      fechaNacimiento: false,
    })
  const [rowSelection, setRowSelection] = React.useState({})
  
  // Estados separados para cada diálogo
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [selectedAnimal, setSelectedAnimal] = React.useState<Animal | null>(null)

  const handleEdit = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsFormOpen(true)
  }

  const handleDelete = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsDeleteOpen(true)
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

  // Estadísticas
  const totalAnimals = data.length
  const publishedAnimals = data.filter(animal => animal.publicado).length
  const dogs = data.filter(animal => animal.especie === "Perro").length
  const cats = data.filter(animal => animal.especie === "Gato").length

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gestión de Animales
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra todos los animales del refugio.
          </p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Animal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animales</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimals}</div>
            <p className="text-xs text-muted-foreground">
              En el refugio actualmente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Badge variant="default" className="h-4 w-4 p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedAnimals}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles para adopción
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perros</CardTitle>
            <Badge variant="outline" className="h-4 w-4 p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dogs}</div>
            <p className="text-xs text-muted-foreground">
              En el refugio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gatos</CardTitle>
            <Badge variant="outline" className="h-4 w-4 p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cats}</div>
            <p className="text-xs text-muted-foreground">
              En el refugio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Animales</CardTitle>
          <CardDescription>
            Gestiona todos los animales del refugio. Puedes filtrar, editar y eliminar registros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre..."
                value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("nombre")?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>
            <Select
              value={(table.getColumn("especie")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("especie")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especies</SelectItem>
                <SelectItem value="Perro">Perros</SelectItem>
                <SelectItem value="Gato">Gatos</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn("publicado")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("publicado")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="true">Publicados</SelectItem>
                <SelectItem value="false">Borradores</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Columns className="mr-2 h-4 w-4" />
                  Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const columnNames: Record<string, string> = {
                      peso: "Peso",
                      fechaNacimiento: "Fecha de Nacimiento",
                      tamano: "Tamaño",
                      sexo: "Sexo",
                      especie: "Especie",
                      publicado: "Estado",
                    }
                    
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          aria-label={`Toggle ${column.id}`}
                        />
                        <span className="ml-2">{columnNames[column.id] || column.id}</span>
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Vistas de Tabla y Tarjetas */}
          
          {/* Vista de Tabla para pantallas medianas y grandes */}
          <div className="hidden md:block">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
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
                          No se encontraron animales.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Vista de Tarjetas para pantallas pequeñas */}
          <div className="md:hidden space-y-3">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const selectCell = row.getVisibleCells().find(c => c.column.id === 'select');
                const photoCell = row.getVisibleCells().find(c => c.column.id === 'fotoUrl');
                const statusCell = row.getVisibleCells().find(c => c.column.id === 'publicado');
                const actionsCell = row.getVisibleCells().find(c => c.column.id === 'actions');

                return (
                  <Card key={row.id} className="w-full">
                    <CardContent className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {selectCell && flexRender(selectCell.column.columnDef.cell, selectCell.getContext())}
                        {photoCell && flexRender(photoCell.column.columnDef.cell, photoCell.getContext())}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{row.original.nombre}</p>
                          <p className="text-sm text-muted-foreground">{row.original.especie}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusCell && flexRender(statusCell.column.columnDef.cell, statusCell.getContext())}
                        {actionsCell && flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="h-24 text-center content-center">
                No se encontraron animales.
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
      <AnimalFormDialog 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen} 
        animal={selectedAnimal} 
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        animalName={selectedAnimal?.nombre}
      />
      <AnimalDetailsDialog
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        animal={selectedAnimal}
      />
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
    const [formData, setFormData] = React.useState<Omit<Animal, 'id'>>({
        nombre: '',
        fotoUrl: '',
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
                fotoUrl: animal.fotoUrl,
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
                fotoUrl: '',
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

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, fotoUrl: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí iría la lógica para guardar
        console.log('Guardando animal:', formData)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {animal ? 'Editar animal' : 'Añadir nuevo animal'}
                    </DialogTitle>
                    <DialogDescription>
                        {animal ? 'Modifica los datos del animal.' : 'Rellena los campos para registrar un nuevo animal.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Foto del animal</Label>
                        <ImageUpload
                            value={formData.fotoUrl}
                            onChange={handleImageChange}
                        />
                    </div>
                    
                    {/* Grid de campos */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input 
                                id="nombre" 
                                value={formData.nombre} 
                                onChange={handleValueChange} 
                                placeholder="Ej: Luna, Max..."
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="especie">Especie *</Label>
                            <Select value={formData.especie} onValueChange={handleSelectChange('especie')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la especie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Perro">Perro</SelectItem>
                                    <SelectItem value="Gato">Gato</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="sexo">Sexo *</Label>
                            <Select value={formData.sexo} onValueChange={handleSelectChange('sexo')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el sexo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Macho">Macho</SelectItem>
                                    <SelectItem value="Hembra">Hembra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="tamano">Tamaño *</Label>
                            <Select value={formData.tamano} onValueChange={handleSelectChange('tamano')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tamaño" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pequeño">Pequeño</SelectItem>
                                    <SelectItem value="Mediano">Mediano</SelectItem>
                                    <SelectItem value="Grande">Grande</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="peso">Peso *</Label>
                            <Input 
                                id="peso" 
                                value={formData.peso} 
                                onChange={handleValueChange} 
                                placeholder="Ej: 15 kg"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                            <Input 
                                id="fechaNacimiento" 
                                type="date" 
                                value={formData.fechaNacimiento} 
                                onChange={handleValueChange} 
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="publicado" 
                            checked={formData.publicado} 
                            onCheckedChange={handleCheckedChange('publicado')} 
                        />
                        <Label htmlFor="publicado" className="text-sm">
                            Publicar inmediatamente en el sitio web
                        </Label>
                    </div>
                    
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {animal ? 'Actualizar' : 'Crear'} Animal
                        </Button>
                    </DialogFooter>
                </form>
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                Eliminar
            </AlertDialogAction>
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Detalles de {animal.nombre}</DialogTitle>
                    <DialogDescription>
                        Información completa del animal
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Foto y info principal */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                                <AvatarImage 
                                    src={animal.fotoUrl} 
                                    alt={animal.nombre} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-xl sm:text-2xl font-bold">
                                    {animal.nombre.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold">{animal.nombre}</h3>
                            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                <Badge variant="outline">{animal.especie}</Badge>
                                <Badge variant="secondary">{animal.sexo}</Badge>
                                <Badge variant={animal.publicado ? "default" : "secondary"}>
                                    {animal.publicado ? "Publicado" : "Borrador"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {/* Detalles */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Tamaño:</span>
                                <span className="text-sm font-medium">{animal.tamano}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Peso:</span>
                                <span className="text-sm font-medium">{animal.peso}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                                <span className="text-sm font-medium">
                                    {new Date(animal.fechaNacimiento).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Edad:</span>
                                <span className="text-sm font-medium">
                                    {Math.floor((new Date().getTime() - new Date(animal.fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365))} años
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cerrar
                    </Button>
                    <Button>
                        Editar Animal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 