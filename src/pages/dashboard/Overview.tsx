import { Heart, Users, PawPrint, TrendingUp, Calendar, AlertCircle, CheckCircle, User, FileText } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivityChart } from "@/components/charts/ActivityChart"
import { useAuth } from "@/hooks/useAuth"
import { useAppStore } from "@/lib/store"
import { useAdopciones } from "@/hooks/useAdopciones"
import { useSeguimientos } from "@/hooks/useSeguimientos"

// Datos mock para administradores
const recentAdoptions = [
  {
    id: 1,
    adopter: "María González",
    animal: "Luna",
    type: "Gato",
    date: "Hace 2 días",
    avatar: "MG"
  },
  {
    id: 2,
    adopter: "Carlos Rodríguez",
    animal: "Max",
    type: "Perro",
    date: "Hace 5 días",
    avatar: "CR"
  },
  {
    id: 3,
    adopter: "Ana Martínez",
    animal: "Rocky",
    type: "Perro",
    date: "Hace 1 semana",
    avatar: "AM"
  },
  {
    id: 4,
    adopter: "Luis Fernández",
    animal: "Bella",
    type: "Gato",
    date: "Hace 1 semana",
    avatar: "LF"
  },
  {
    id: 5,
    adopter: "Sofia Pérez",
    animal: "Charlie",
    type: "Perro",
    date: "Hace 2 semanas",
    avatar: "SP"
  }
];

const pendingTasks = [
  {
    id: 1,
    title: "Revisar solicitudes de adopción",
    count: 8,
    priority: "high",
    icon: AlertCircle
  },
  {
    id: 2,
    title: "Citas veterinarias pendientes",
    count: 5,
    priority: "medium",
    icon: Calendar
  },
  {
    id: 3,
    title: "Voluntarios para este fin de semana",
    count: 3,
    priority: "low",
    icon: Users
  }
];

export default function Overview() {
  const { usuario } = useAuth()
  const { isColaborator } = useAppStore()
  const { adopciones } = useAdopciones()
  const { seguimientos } = useSeguimientos()

  // Estadísticas para usuarios adoptantes
  const userStats = {
    solicitudesPendientes: adopciones.filter(a => a.adopcionEstado.nombre === 'Pendiente').length,
    adopcionesAprobadas: adopciones.filter(a => a.adopcionEstado.nombre === 'Aprobada').length,
    seguimientosActivos: seguimientos.filter(s => s.estado === 'Activo').length,
    totalSeguimientos: seguimientos.length
  };

  if (isColaborator) {
    // Vista para colaboradores
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isColaborator ? "Panel de Control" : "Mi Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isColaborator 
              ? "Resumen general del refugio y estadísticas importantes."
              : "Resumen de tus adopciones y seguimientos."
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isColaborator ? "Animales Disponibles" : "Mis Solicitudes Pendientes"}
              </CardTitle>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <PawPrint className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isColaborator ? "24" : userStats.solicitudesPendientes}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {isColaborator ? "+3 esta semana" : "En revisión"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isColaborator ? "Adopciones Este Mes" : "Mis Adopciones Aprobadas"}
              </CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isColaborator ? "12" : userStats.adopcionesAprobadas}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {isColaborator ? "+2 esta semana" : "¡Felicidades!"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isColaborator ? "Solicitudes Pendientes" : "Mis Seguimientos Activos"}
              </CardTitle>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isColaborator ? "8" : userStats.seguimientosActivos}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-orange-500" />
                {isColaborator ? "+3 nuevas hoy" : "En progreso"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isColaborator ? "Voluntarios Activos" : "Total Seguimientos"}
              </CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isColaborator ? "15" : userStats.totalSeguimientos}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {isColaborator ? "+2 nuevos" : "Historial completo"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Activity Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>
                {isColaborator ? "Actividad del Refugio" : "Mi Actividad"}
              </CardTitle>
              <CardDescription>
                {isColaborator 
                  ? "Adopciones y solicitudes en los últimos 12 meses."
                  : "Tus adopciones y seguimientos en los últimos 12 meses."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>

          {/* Recent Adoptions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {isColaborator ? "Adopciones Recientes" : "Mis Adopciones"}
              </CardTitle>
              <CardDescription>
                {isColaborator 
                  ? "Los últimos 5 animales adoptados."
                  : "Tus últimas adopciones aprobadas."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  recentAdoptions.map((adoption) => (
                    <div key={adoption.id} className="flex items-center space-x-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {adoption.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {adoption.adopter}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Adoptó a {adoption.animal} ({adoption.type})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {adoption.date}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Completada
                      </Badge>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>
              Actividades que requieren atención inmediata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.priority === 'high' ? 'bg-red-100' :
                      task.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <task.icon className={`w-5 h-5 ${
                        task.priority === 'high' ? 'text-red-600' :
                        task.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.count} {task.count === 1 ? 'item' : 'items'} pendiente{task.count === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {task.priority === 'high' ? 'Alta' :
                     task.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista para usuarios adoptantes
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Mi Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tus adopciones y seguimientos.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mis Solicitudes Pendientes
            </CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.solicitudesPendientes}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-orange-500" />
              En revisión
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mis Adopciones Aprobadas
            </CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.adopcionesAprobadas}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              ¡Felicidades!
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mis Seguimientos Activos
            </CardTitle>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.seguimientosActivos}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              En progreso
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Seguimientos
            </CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.totalSeguimientos}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              Historial completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Activity Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Mi Actividad</CardTitle>
            <CardDescription>
              Tus adopciones y seguimientos en los últimos 12 meses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>

        {/* Recent Adoptions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Mis Adopciones</CardTitle>
            <CardDescription>
              Tus últimas adopciones aprobadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.adopcionesAprobadas > 0 ? (
                recentAdoptions.slice(0, userStats.adopcionesAprobadas).map((adoption) => (
                  <div key={adoption.id} className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {adoption.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {adoption.adopter}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Adoptó a {adoption.animal} ({adoption.type})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {adoption.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Completada
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aún no tienes adopciones aprobadas.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ¡Explora los animales disponibles!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}