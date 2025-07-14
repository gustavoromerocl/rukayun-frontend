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
import { MoreHorizontal, Search, FileText, CheckCircle2, History, Plus } from "lucide-react"

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
import { useSeguimientos } from "@/hooks/useSeguimientos"
import { useAdopciones } from "@/hooks/useAdopciones"
import { useAuth } from "@/hooks/useAuth"
import { useAppStore } from "@/lib/store"
import type { Seguimiento as SeguimientoBackend } from "@/services/seguimientosService"
import type { Adopcion } from "@/services/adopcionesService"
import { toast } from "sonner"

// Tipo para la tabla que combina datos del backend con datos calculados
export type SeguimientoTable = SeguimientoBackend & {
  animalNombre?: string;
  adoptanteNombre?: string;
}

export const columns: ColumnDef<SeguimientoTable>[] = [
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
    accessorKey: "adoptanteNombre",
    header: "Adoptante",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("adoptanteNombre")}</div>
    )
  },
  {
    accessorKey: "animalNombre",
    header: "Animal",
  },
  {
    accessorKey: "fechaSeguimiento",
    header: "Fecha de Seguimiento",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fechaSeguimiento"))
      return <div className="text-sm">{fecha.toLocaleDateString('es-ES')}</div>
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    enableColumnFilter: true,
    cell: ({ row }) => {
        const estado = row.getValue("estado") as string
        
        return <Badge variant={estado === 'Activo' ? 'default' : 'secondary'}>{estado}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
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
            <DropdownMenuItem onClick={() => meta.handleViewHistory(row.original)}>
                <History className="mr-2 h-4 w-4" /> Ver Historial
            </DropdownMenuItem>
            {isColaborator && (
              <>
                <DropdownMenuItem onClick={() => meta.handleRegisterInteraction(row.original)}>
                    <Plus className="mr-2 h-4 w-4" /> Registrar Interacción
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => meta.handleFinishFollowUp(row.original)}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar Seguimiento
                </DropdownMenuItem>
              </>
            )}
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
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedSeguimiento, setSelectedSeguimiento] = React.useState<SeguimientoTable | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  // Usar el hook de seguimientos y el store
  const { 
    seguimientos, 
    loading, 
    error, 
    fetchSeguimientos, 
    fetchSeguimientosByUsuario,
    updateSeguimiento,
    createSeguimiento
  } = useSeguimientos()
  const { isColaborator } = useAppStore()
  const { usuario } = useAuth()

  // LOG: Verificar datos crudos del backend
  console.log('seguimientos:', seguimientos);

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
        console.log('📡 Cargando todos los seguimientos (colaborador)');
        // Colaboradores ven todos los seguimientos
        fetchSeguimientos()
      } else if (usuario?.usuarioId) {
        console.log('📡 Cargando seguimientos del usuario:', usuario.usuarioId);
        // Usuarios adoptantes ven solo sus seguimientos
        fetchSeguimientosByUsuario(usuario.usuarioId)
      }
    }

    loadData()
    hasLoadedRef.current = true;
    console.log('✅ useEffect completado, hasLoadedRef establecido en true');
  }, [isColaborator, usuario?.usuarioId, fetchSeguimientos, fetchSeguimientosByUsuario]) // Incluir las funciones en las dependencias

  // Transformar datos del backend para la tabla
  const tableData: SeguimientoTable[] = React.useMemo(() => {
    if (!seguimientos || !Array.isArray(seguimientos)) {
      console.log('tableData: seguimientos vacío o no array');
      return [];
    }
    const data = seguimientos.map(s => {
      const anyS = s as any;
      return {
        ...s,
        animalNombre: anyS.animalNombre || s.adopcion?.animal?.nombre || 'N/A',
        adoptanteNombre: anyS.usuarioNombre || (
          s.adopcion?.adoptante
            ? `${s.adopcion.adoptante.nombres} ${s.adopcion.adoptante.apellidos}`
            : 'N/A'
        ),
        estado: anyS.seguimientoEstado?.nombre || s.estado || 'N/A',
        fechaSeguimiento: anyS.fechaInteraccion || s.fechaSeguimiento || 'N/A',
      };
    });
    console.log('tableData: mapeado', data);
    return data;
  }, [seguimientos]);

  // LOG: Verificar datos que llegan a la tabla
  React.useEffect(() => {
    console.log('tableData (useEffect):', tableData);
  }, [tableData]);

  // Efecto para refrescar la tabla cuando cambie el refreshTrigger
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      if (isColaborator) {
        fetchSeguimientos()
      } else if (usuario?.usuarioId) {
        fetchSeguimientosByUsuario(usuario.usuarioId)
      }
    }
  }, [refreshTrigger, isColaborator, usuario?.usuarioId, fetchSeguimientos, fetchSeguimientosByUsuario])

  const handleAddNew = () => {
    setSelectedSeguimiento(null)
    setIsFormOpen(true)
  }

  const handleRegisterInteraction = (seguimiento: SeguimientoTable) => {
    setSelectedSeguimiento(seguimiento)
    setIsRegisterOpen(true)
  }

  const handleViewHistory = (seguimiento: SeguimientoTable) => {
    setSelectedSeguimiento(seguimiento)
    setIsHistoryOpen(true)
  }

  const handleFinishFollowUp = (seguimiento: SeguimientoTable) => {
    setSelectedSeguimiento(seguimiento)
    setIsConfirmOpen(true)
  }

  const totalSeguimientos = tableData.length
  const seguimientosActivos = tableData.filter(s => s.estado === 'Activo').length
  const seguimientosCerrados = tableData.filter(s => s.estado === 'Cerrado').length

  const handleConfirmFinish = async () => {
    if (selectedSeguimiento) {
      try {
        await updateSeguimiento(selectedSeguimiento.seguimientoId, {
          estado: 'Cerrado'
        })
        
        setIsConfirmOpen(false)
        setSelectedSeguimiento(null)
        
        toast.success('Seguimiento finalizado exitosamente')
        
        // Refrescar la lista - CORREGIR ESTA LÍNEA
        if (isColaborator) {
          fetchSeguimientos()
        } else if (usuario?.usuarioId) {
          fetchSeguimientosByUsuario(usuario.usuarioId)
        }
        
      } catch (error) {
        console.error('Error al finalizar seguimiento:', error)
        toast.error('Error al finalizar el seguimiento')
      }
    }
  }

  const table = useReactTable({
    data: tableData,
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
      isColaborator,
    },
  })

  // AHORA los returns condicionales después de todos los hooks
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {isColaborator ? "Seguimiento de Adopciones" : "Mis Seguimientos"}
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seguimientos</CardTitle>
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
            {isColaborator ? "Seguimiento de Adopciones" : "Mis Seguimientos"}
          </h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => {
                if (isColaborator) {
                  fetchSeguimientos()
                } else if (usuario?.usuarioId) {
                  fetchSeguimientosByUsuario(usuario.usuarioId)
                }
              }}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // LOG: Verificar rows que la tabla va a renderizar
  // (esto debe ir justo antes del return)
  // @ts-ignore
  if (typeof table !== 'undefined' && table.getRowModel) {
    // @ts-ignore
    console.log('table.getRowModel().rows:', table.getRowModel().rows);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isColaborator ? "Seguimiento de Adopciones" : "Mis Seguimientos"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isColaborator 
              ? "Gestiona y registra las interacciones con los adoptantes."
              : "Revisa el estado de tus adopciones y el seguimiento de tus mascotas."
            }
          </p>
        </div>
        {isColaborator && (
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Seguimiento
          </Button>
        )}
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
          <CardTitle>
            {isColaborator ? "Lista de Seguimientos" : "Mis Seguimientos"}
          </CardTitle>
          <CardDescription>
            {isColaborator 
              ? "Busca y filtra los seguimientos por adoptante, animal o estado."
              : "Revisa el estado de tus adopciones y el seguimiento de tus mascotas."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={isColaborator ? "Buscar por adoptante o animal..." : "Buscar por animal..."}
                value={(table.getColumn("adoptanteNombre")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("adoptanteNombre")?.setFilterValue(event.target.value)
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
                  {table.getHeaderGroups() && table.getHeaderGroups().length > 0 ? (
                    table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers && headerGroup.headers.length > 0 ? (
                          headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))
                        ) : null}
                      </TableRow>
                    ))
                  ) : null}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells() && row.getVisibleCells().length > 0 ? (
                          row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))
                        ) : null}
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
            {table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const { adoptanteNombre, animalNombre, fechaSeguimiento, estado } = row.original || {}
                const actionsCell = row.getVisibleCells() && row.getVisibleCells().find(c => c.column.id === 'actions');

                return (
                  <Card key={row.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{adoptanteNombre || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground truncate">Animal: {animalNombre || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fecha de seguimiento: {fechaSeguimiento ? new Date(fechaSeguimiento).toLocaleDateString('es-ES') : 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={estado === 'Activo' ? 'default' : 'secondary'}>{estado || 'N/A'}</Badge>
                        {actionsCell && actionsCell.column && flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron seguimientos.
              </div>
            )}
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
        onConfirm={handleConfirmFinish}
      />
      <SeguimientoFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onRefresh={() => setRefreshTrigger(prev => prev + 1)}
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
    seguimiento: SeguimientoTable | null
    }) {
    
    if (!seguimiento) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar Interacción</DialogTitle>
                    <DialogDescription>
                        Para el seguimiento de <span className="font-semibold">{seguimiento.animalNombre}</span> con <span className="font-semibold">{seguimiento.adoptanteNombre}</span>.
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
    seguimiento: SeguimientoTable | null
    }) {

    if (!seguimiento) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Historial de Seguimiento</DialogTitle>
                    <DialogDescription>
                        Mostrando el historial para <span className="font-semibold">{seguimiento.animalNombre}</span> con <span className="font-semibold">{seguimiento.adoptanteNombre}</span>.
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
    onConfirm,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    seguimiento: SeguimientoTable | null
    onConfirm: () => void
    }) {
    
    if (!seguimiento) return null

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar seguimiento?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción marcará el seguimiento de <span className="font-semibold">{seguimiento.animalNombre}</span> como "Cerrado".
                No podrás registrar nuevas interacciones. ¿Estás seguro?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Confirmar y Finalizar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}

function SeguimientoFormDialog({
    isOpen,
    setIsOpen,
    onRefresh,
    }: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onRefresh: () => void
    }) {
    
    const [formData, setFormData] = React.useState({
        adopcionId: 0,
        seguimientoTipoId: 10, // Valor por defecto según el curl
        fechaInteraccion: new Date().toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:MM
        descripcion: ""
    })
    const [formErrors, setFormErrors] = React.useState<{[key: string]: string}>({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Hook para obtener adopciones
    const { adopciones, fetchAdopciones } = useAdopciones()
    const { createSeguimiento } = useSeguimientos()

    // Cargar adopciones al abrir el diálogo
    React.useEffect(() => {
        if (isOpen) {
            fetchAdopciones()
        }
    }, [isOpen, fetchAdopciones])

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Limpiar error del campo
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const handleSelectChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: parseInt(value) }))
        // Limpiar error del campo
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const resetForm = () => {
        setFormData({
            adopcionId: 0,
            seguimientoTipoId: 10,
            fechaInteraccion: new Date().toISOString().slice(0, 16),
            descripcion: ""
        })
        setFormErrors({})
    }

    const validateForm = () => {
        const errors: {[key: string]: string} = {}
        
        if (!formData.adopcionId) {
            errors.adopcionId = 'Debes seleccionar una adopción'
        }
        
        if (!formData.seguimientoTipoId) {
            errors.seguimientoTipoId = 'Debes seleccionar un tipo de seguimiento'
        }
        
        if (!formData.fechaInteraccion) {
            errors.fechaInteraccion = 'La fecha de interacción es obligatoria'
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            toast.error('Por favor, completa todos los campos obligatorios')
            return
        }
        
        setIsSubmitting(true)
        try {
            await createSeguimiento({
                adopcionId: formData.adopcionId,
                seguimientoTipoId: formData.seguimientoTipoId,
                fechaInteraccion: new Date(formData.fechaInteraccion).toISOString(),
                descripcion: formData.descripcion
            })
            
            toast.success('Seguimiento creado exitosamente')
            setIsOpen(false)
            resetForm()
            onRefresh()
            
        } catch (error: any) {
            console.error('Error al crear seguimiento:', error)
            toast.error(error?.message || 'Error al crear el seguimiento')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseModal = () => {
        setIsOpen(false)
        resetForm()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Seguimiento</DialogTitle>
                    <DialogDescription>
                        Registra un nuevo seguimiento para una adopción existente.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="adopcionId">Adopción</Label>
                        <Select 
                            value={formData.adopcionId.toString()} 
                            onValueChange={handleSelectChange('adopcionId')}
                        >
                            <SelectTrigger id="adopcionId" className={formErrors.adopcionId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Selecciona una adopción" />
                            </SelectTrigger>
                            <SelectContent>
                                {adopciones.map((adopcion) => (
                                    <SelectItem key={adopcion.adopcionId} value={adopcion.adopcionId.toString()}>
                                        {adopcion.animal.nombre} - {adopcion.usuario?.nombres} {adopcion.usuario?.apellidos}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.adopcionId && (
                            <p className="text-sm text-red-500">{formErrors.adopcionId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seguimientoTipoId">Tipo de Seguimiento</Label>
                        <Select 
                            value={formData.seguimientoTipoId.toString()} 
                            onValueChange={handleSelectChange('seguimientoTipoId')}
                        >
                            <SelectTrigger id="seguimientoTipoId" className={formErrors.seguimientoTipoId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">Llamada Telefónica</SelectItem>
                                <SelectItem value="11">Visita Domiciliaria</SelectItem>
                                <SelectItem value="12">Correo Electrónico</SelectItem>
                                <SelectItem value="13">Mensaje de Texto</SelectItem>
                            </SelectContent>
                        </Select>
                        {formErrors.seguimientoTipoId && (
                            <p className="text-sm text-red-500">{formErrors.seguimientoTipoId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fechaInteraccion">Fecha de Interacción</Label>
                        <Input
                            id="fechaInteraccion"
                            name="fechaInteraccion"
                            type="datetime-local"
                            value={formData.fechaInteraccion}
                            onChange={handleValueChange}
                            className={formErrors.fechaInteraccion ? 'border-red-500' : ''}
                        />
                        {formErrors.fechaInteraccion && (
                            <p className="text-sm text-red-500">{formErrors.fechaInteraccion}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            name="descripcion"
                            placeholder="Describe la interacción realizada..."
                            value={formData.descripcion}
                            onChange={handleValueChange}
                            rows={4}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear Seguimiento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 