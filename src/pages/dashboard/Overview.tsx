import { Activity, Heart, Users, PawPrint, TrendingUp, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            ¡Bienvenido de vuelta! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes un resumen de la actividad del refugio hoy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% este mes
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Animales en el Refugio
            </CardTitle>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <PawPrint className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +3 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Adopciones Este Mes
            </CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +2 esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitudes Pendientes
            </CardTitle>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              +3 nuevas hoy
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voluntarios Activos
            </CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3 text-blue-500" />
              8 disponibles hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Activity Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Actividad del Refugio</CardTitle>
            <CardDescription>
              Adopciones y solicitudes en los últimos 12 meses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>

        {/* Recent Adoptions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Adopciones Recientes</CardTitle>
            <CardDescription>
              Los últimos 5 animales adoptados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAdoptions.map((adoption) => (
                <div key={adoption.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/avatars/${adoption.avatar}.png`} alt={adoption.adopter} />
                    <AvatarFallback className="text-sm font-medium">
                      {adoption.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {adoption.adopter}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {adoption.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Adoptó a "{adoption.animal}"
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {adoption.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
          <CardDescription>
            Acciones que requieren tu atención.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  task.priority === 'high' ? 'bg-red-100' :
                  task.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  <task.icon className={`w-5 h-5 ${
                    task.priority === 'high' ? 'text-red-600' :
                    task.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.count} {task.count === 1 ? 'item' : 'items'} pendiente{task.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' :
                  task.priority === 'medium' ? 'secondary' : 'outline'
                } className="text-xs">
                  {task.priority === 'high' ? 'Alta' :
                   task.priority === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 