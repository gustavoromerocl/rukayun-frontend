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
import { MoreHorizontal, Plus, Search, PawPrint, Eye, Edit, Trash2, Columns } from "lucide-react"
import { toast } from "sonner"

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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnimales } from "@/hooks/useAnimales"
import type { Animal } from "@/services/animalesService"
import { ImageUpload } from "@/components/ui/image-upload"

// Tipos actualizados para coincidir con la API real
export type AnimalTable = Animal

// Funciones de manejo que se usarán en las columnas
const createColumnHandlers = () => {
  let handlers: {
    handleViewDetails: (animal: AnimalTable) => void;
    handleEdit: (animal: AnimalTable) => void;
    handleTogglePublicacion: (animal: AnimalTable) => void;
    handleDelete: (animal: AnimalTable) => void;
  } | null = null;

  return {
    setHandlers: (newHandlers: typeof handlers) => {
      handlers = newHandlers;
    },
    getHandlers: () => handlers,
  };
};

const columnHandlers = createColumnHandlers();

export const columns: ColumnDef<AnimalTable>[] = [
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
    accessorKey: "animalImagenes",
    header: "Foto",
    cell: ({ row }) => {
      const animal = row.original;
      const imagenUrl = animal.animalImagenes.length > 0 
        ? animal.animalImagenes[0].url 
        : undefined;
      
      return (
        <div className="flex items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={imagenUrl} 
              alt={animal.nombre}
              className="object-cover"
            />
            <AvatarFallback className="text-sm font-medium">
              {animal.nombre.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
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
        {row.original.especie.nombre}
      </Badge>
    ),
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.sexo.nombre}
      </Badge>
    ),
  },
  {
    accessorKey: "tamano",
    header: "Tamaño",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.tamano.nombre}
      </Badge>
    ),
  },
  {
    accessorKey: "peso",
    header: "Peso",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.peso} kg</div>
    ),
  },
  {
    accessorKey: "edad",
    header: "Edad",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.edad} años</div>
    ),
  },
  {
    accessorKey: "publicado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.publicado ? "default" : "secondary"}>
        {row.original.publicado ? "Publicado" : "Borrador"}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const animal = row.original
      const handlers = columnHandlers.getHandlers();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handlers?.handleViewDetails(animal)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handlers?.handleEdit(animal)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handlers?.handleTogglePublicacion(animal)}
              className={animal.publicado ? "text-orange-600" : "text-green-600"}
            >
              <PawPrint className="mr-2 h-4 w-4" />
              {animal.publicado ? "Despublicar" : "Publicar"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handlers?.handleDelete(animal)}
              className="text-red-600"
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
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [selectedAnimal, setSelectedAnimal] = React.useState<AnimalTable | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  // Usar el hook de animales
  const { 
    animales, 
    loading, 
    error, 
    fetchAnimales, 
    deleteAnimal, 
    togglePublicacion
  } = useAnimales()

  // Cargar datos al montar el componente
  React.useEffect(() => {
    fetchAnimales()
  }, [fetchAnimales])

  // Efecto para refrescar la tabla cuando cambie el refreshTrigger
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 Refrescando tabla por trigger:', refreshTrigger)
      fetchAnimales()
    }
  }, [refreshTrigger, fetchAnimales])

  const handleEdit = (animal: AnimalTable) => {
    setSelectedAnimal(animal)
    setIsFormOpen(true)
  }

  const handleDelete = (animal: AnimalTable) => {
    setSelectedAnimal(animal)
    setIsDeleteOpen(true)
  }

  const handleViewDetails = (animal: AnimalTable) => {
    setSelectedAnimal(animal)
    setIsDetailsOpen(true)
  }

  const handleAddNew = () => {
    setSelectedAnimal(null)
    setIsFormOpen(true)
  }

  const handleTogglePublicacion = async (animal: AnimalTable) => {
    try {
      await togglePublicacion(animal.animalId, !animal.publicado)
    } catch (error) {
      console.error('Error al cambiar publicación:', error)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedAnimal) {
      try {
        console.log('🗑️ Confirmando eliminación de animal:', selectedAnimal.animalId);
        await deleteAnimal(selectedAnimal.animalId)
        
        // Cerrar el diálogo de confirmación
        setIsDeleteOpen(false)
        setSelectedAnimal(null)
        
        // Mostrar mensaje de éxito
        toast.success(`Animal "${selectedAnimal.nombre}" eliminado exitosamente`)
        
        // Refrescar la tabla después de un pequeño delay
        setTimeout(async () => {
          try {
            console.log('🔄 Refrescando tabla después de eliminar animal...')
            await fetchAnimales()
            console.log('✅ Tabla refrescada exitosamente')
          } catch (refreshError) {
            console.error('❌ Error al refrescar tabla:', refreshError)
            toast.warning('Animal eliminado, pero hubo un problema al actualizar la lista.')
          }
        }, 500)
        
      } catch (error) {
        console.error('Error al eliminar animal:', error)
        toast.error('Ocurrió un error al eliminar el animal. Intenta nuevamente.')
      }
    }
  }

  // Configurar handlers para las columnas
  React.useEffect(() => {
    columnHandlers.setHandlers({
      handleViewDetails,
      handleEdit,
      handleTogglePublicacion,
      handleDelete,
    });
  }, []);

  const table = useReactTable({
    data: animales,
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
  })

  // Estadísticas
  const totalAnimals = animales.length
  const publishedAnimals = animales.filter(animal => animal.publicado).length
  const dogs = animales.filter(animal => animal.especie.nombre === "Perro").length
  const cats = animales.filter(animal => animal.especie.nombre === "Gato").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Animales</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Animales</CardTitle>
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
          <h2 className="text-3xl font-bold tracking-tight">Animales</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error al cargar los animales: {error}</p>
              <Button onClick={() => fetchAnimales()} className="mt-4">
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
                const photoCell = row.getVisibleCells().find(c => c.column.id === 'animalImagenes');
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
                          <p className="text-sm text-muted-foreground">{row.original.especie.nombre}</p>
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
        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        animalName={selectedAnimal?.nombre}
        onConfirm={handleConfirmDelete}
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
    onRefresh,
  }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    animal: AnimalTable | null
    onRefresh: () => void
  }) {
    const { createAnimal, updateAnimal, uploadAnimalImage, deleteAnimalImage } = useAnimales()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isDeletingImage, setIsDeletingImage] = React.useState(false)
    const [imageFile, setImageFile] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string>('')
    const [currentServerImage, setCurrentServerImage] = React.useState<{ animalId: number; imagenId: number; url: string } | null>(null)
    const [needsRefresh, setNeedsRefresh] = React.useState(false)

    // Estado del formulario
    const [formData, setFormData] = React.useState({
        nombre: '',
        peso: 0,
        fechaNacimiento: '',
        descripcion: '',
        especieId: 1,
        sexoId: 1,
        tamanoId: 1,
        nivelActividadId: 1,
        organizacionId: 1,
        publicado: true,
    })

    // Cargar datos del animal cuando se abre el formulario
    React.useEffect(() => {
        if (animal) {
            setFormData({
                nombre: animal.nombre,
                peso: animal.peso,
                fechaNacimiento: animal.fechaNacimiento,
                descripcion: animal.descripcion,
                especieId: animal.especieId,
                sexoId: animal.sexoId,
                tamanoId: animal.tamanoId,
                nivelActividadId: animal.nivelActividadId,
                organizacionId: animal.organizacionId,
                publicado: animal.publicado,
            })
            
            // Si el animal tiene imágenes, mostrar la primera
            if (animal.animalImagenes && animal.animalImagenes.length > 0) {
                const primeraImagen = animal.animalImagenes[0]
                setImagePreview(primeraImagen.url)
                setCurrentServerImage({
                    animalId: animal.animalId,
                    imagenId: primeraImagen.animalImagenId,
                    url: primeraImagen.url
                })
            } else {
                setImagePreview('')
                setCurrentServerImage(null)
            }
        } else {
            resetForm()
        }
    }, [animal])

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSelectChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: parseInt(value) }))
    }

    const handleImageChange = (value: string) => {
        setImagePreview(value)
        // Si se selecciona una nueva imagen, limpiar la imagen del servidor
        setCurrentServerImage(null)
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput && fileInput.files && fileInput.files[0]) {
            setImageFile(fileInput.files[0])
        }
    }

    const handleRemoveServerImage = async () => {
        if (currentServerImage) {
            setIsDeletingImage(true)
            try {
                console.log('🗑️ Eliminando imagen del servidor:', currentServerImage.imagenId)
                
                // Primero eliminar del servidor
                await deleteAnimalImage(currentServerImage.animalId, currentServerImage.imagenId)
                console.log('✅ Imagen eliminada exitosamente')
                
                // Solo después de confirmar que se eliminó, limpiar el estado local
                setImagePreview('')
                setCurrentServerImage(null)
                
                // Marcar que se necesita refrescar la tabla cuando se cierre el modal
                setNeedsRefresh(true)
                
                toast.success('Imagen eliminada exitosamente')
                
            } catch (error) {
                console.error('Error al eliminar imagen:', error)
                toast.error('Error al eliminar la imagen. Intenta nuevamente.')
                // No restaurar nada porque la imagen nunca se eliminó del estado
            } finally {
                setIsDeletingImage(false)
            }
        }
    }

    const resetForm = () => {
        setFormData({
            nombre: '',
            peso: 0,
            fechaNacimiento: '',
            descripcion: '',
            especieId: 1,
            sexoId: 1,
            tamanoId: 1,
            nivelActividadId: 1,
            organizacionId: 1,
            publicado: true,
        })
        setImageFile(null)
        setImagePreview('')
        setCurrentServerImage(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            let updatedAnimal;
            
            if (animal) {
                // Modo edición - actualizar animal existente
                console.log('✏️ Modo edición - actualizando animal:', animal.animalId);
                updatedAnimal = await updateAnimal(animal.animalId, {
                    nombre: formData.nombre,
                    peso: formData.peso,
                    fechaNacimiento: formData.fechaNacimiento,
                    descripcion: formData.descripcion,
                    especieId: formData.especieId,
                    sexoId: formData.sexoId,
                    organizacionId: formData.organizacionId,
                    tamanoId: formData.tamanoId,
                    nivelActividadId: formData.nivelActividadId,
                    publicado: formData.publicado,
                });
            } else {
                // Modo creación - crear nuevo animal
                console.log('🆕 Modo creación - creando nuevo animal');
                updatedAnimal = await createAnimal({
                    nombre: formData.nombre,
                    peso: formData.peso,
                    fechaNacimiento: formData.fechaNacimiento,
                    descripcion: formData.descripcion,
                    especieId: formData.especieId,
                    sexoId: formData.sexoId,
                    organizacionId: formData.organizacionId,
                    tamanoId: formData.tamanoId,
                    nivelActividadId: formData.nivelActividadId,
                    publicado: formData.publicado,
                });
            }
            
            // Si hay imagen nueva, intentar subirla (pero no fallar si hay error)
            if (imageFile && updatedAnimal.animalId) {
                try {
                    await uploadAnimalImage(updatedAnimal.animalId, imageFile)
                } catch (imageError) {
                    console.warn('Error al subir imagen, pero el animal se guardó correctamente:', imageError)
                    // No lanzar el error, solo mostrar un warning
                    toast.warning(`Animal ${animal ? 'actualizado' : 'creado'} exitosamente, pero hubo un problema al subir la imagen.`)
                }
            }
            
            // Cerrar formulario y limpiar
            setIsOpen(false)
            resetForm()
            
            // Marcar que se necesita refrescar la tabla
            setNeedsRefresh(true)
            
            // Mostrar mensaje de éxito (solo si no se mostró el warning)
            if (!imageFile || !updatedAnimal.animalId) {
                toast.success(`¡Animal ${animal ? 'actualizado' : 'creado'} exitosamente!`)
            }
        } catch (error) {
            console.error(`Error al ${animal ? 'actualizar' : 'crear'} animal:`, error)
            toast.error(`Ocurrió un error al ${animal ? 'actualizar' : 'crear'} el animal. Intenta nuevamente.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Función para manejar el cierre del modal
    const handleCloseModal = () => {
        setIsOpen(false)
        resetForm()
        // Solo refrescar si es necesario
        if (needsRefresh) {
            setTimeout(() => {
                onRefresh()
                setNeedsRefresh(false)
            }, 100)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
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
                            value={imagePreview}
                            onChange={handleImageChange}
                            onRemove={handleRemoveServerImage}
                            isServerImage={!!currentServerImage}
                            loading={isDeletingImage}
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
                            <Label htmlFor="peso">Peso (kg) *</Label>
                            <Input 
                                id="peso" 
                                type="number"
                                step="0.1"
                                value={formData.peso} 
                                onChange={handleValueChange} 
                                placeholder="Ej: 15.5"
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
                        
                        <div className="space-y-2">
                            <Label htmlFor="especieId">Especie *</Label>
                            <Select value={formData.especieId.toString()} onValueChange={handleSelectChange('especieId')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la especie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Perro</SelectItem>
                                    <SelectItem value="2">Gato</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="sexoId">Sexo *</Label>
                            <Select value={formData.sexoId.toString()} onValueChange={handleSelectChange('sexoId')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el sexo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Macho</SelectItem>
                                    <SelectItem value="2">Hembra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="tamanoId">Tamaño *</Label>
                            <Select value={formData.tamanoId.toString()} onValueChange={handleSelectChange('tamanoId')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tamaño" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Pequeño</SelectItem>
                                    <SelectItem value="2">Mediano</SelectItem>
                                    <SelectItem value="3">Grande</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="nivelActividadId">Nivel de Actividad *</Label>
                            <Select value={formData.nivelActividadId.toString()} onValueChange={handleSelectChange('nivelActividadId')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el nivel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Bajo</SelectItem>
                                    <SelectItem value="2">Medio</SelectItem>
                                    <SelectItem value="3">Alto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input 
                            id="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleValueChange} 
                            placeholder="Describe al animal..."
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="publicado"
                            checked={formData.publicado}
                            onChange={handleValueChange}
                            className="rounded"
                        />
                        <Label htmlFor="publicado">Publicar inmediatamente</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : (animal ? 'Actualizar' : 'Crear') + ' Animal'}
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
    onConfirm,
  }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    animalName?: string
    onConfirm: () => Promise<void>
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
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
    animal: AnimalTable | null
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
                                    src={animal.animalImagenes.length > 0 ? animal.animalImagenes[0].url : ''} 
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
                                <Badge variant="outline">{animal.especie.nombre}</Badge>
                                <Badge variant="secondary">{animal.sexo.nombre}</Badge>
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
                                <span className="text-sm font-medium">{animal.tamano.nombre}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Peso:</span>
                                <span className="text-sm font-medium">{animal.peso}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Edad:</span>
                                <span className="text-sm font-medium">
                                    {animal.edad} años
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