"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { Switch } from "@/components/ui/switch"

export default function Configuracion() {
  const [activeTab, setActiveTab] = React.useState("perfil")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona el perfil de tu organización, apariencia y notificaciones.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <nav className="md:col-span-1 space-y-1">
          <Button variant={activeTab === 'perfil' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('perfil')} className="w-full justify-start">
            Perfil
          </Button>
          <Button variant={activeTab === 'apariencia' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('apariencia')} className="w-full justify-start">
            Apariencia
          </Button>
          <Button variant={activeTab === 'notificaciones' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('notificaciones')} className="w-full justify-start">
            Notificaciones
          </Button>
        </nav>

        <div className="md:col-span-3">
          {activeTab === 'perfil' && (
            <Card>
              <CardHeader>
                <CardTitle>Perfil de la Organización</CardTitle>
                <CardDescription>
                  Actualiza la información pública de tu refugio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nombre del Refugio</Label>
                  <Input id="org-name" defaultValue="Refugio Esperanza" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Email de Contacto</Label>
                  <Input id="org-email" type="email" defaultValue="contacto@esperanza.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-phone">Teléfono</Label>
                  <Input id="org-phone" type="tel" defaultValue="+56 9 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-address">Dirección</Label>
                  <Input id="org-address" defaultValue="Av. Siempre Viva 742, Santiago" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-description">Descripción Breve</Label>
                  <Textarea
                    id="org-description"
                    placeholder="Cuéntanos sobre tu refugio..."
                    defaultValue="Somos un refugio dedicado a rescatar, rehabilitar y encontrar hogares amorosos para animales en situación de calle."
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'apariencia' && (
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el tema para el dashboard.
                    </p>
                  </div>
                  <ModeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Idioma</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el idioma de la interfaz.
                    </p>
                  </div>
                  <Select defaultValue="es">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notificaciones' && (
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Elige cómo quieres recibir notificaciones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activa o desactiva todas las notificaciones por correo.
                    </p>
                  </div>
                  <Switch id="notifications-email" defaultChecked />
                </div>
                <div className="space-y-3 pt-4">
                  <h4 className="text-sm font-medium mb-2">Alertas Específicas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-solicitud" className="font-normal">
                        Nuevas solicitudes de adopción
                      </Label>
                      <Switch id="notification-solicitud" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-seguimiento" className="font-normal">
                        Recordatorios de seguimiento
                      </Label>
                      <Switch id="notification-seguimiento" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-contacto" className="font-normal">
                        Nuevos mensajes de contacto
                      </Label>
                      <Switch id="notification-contacto" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Guardar Preferencias</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 