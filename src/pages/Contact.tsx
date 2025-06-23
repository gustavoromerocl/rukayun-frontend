import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, Users, Heart } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = React.useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, asunto: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      })
    }, 3000)
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Contacto</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Estamos aquí para{" "}
              <span className="text-primary">ayudarte</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ¿Tienes preguntas sobre adopción, quieres ser voluntario o necesitas información? 
              Nuestro equipo está listo para responder todas tus consultas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>Respuesta en 24h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Equipo disponible</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Atención personalizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Formulario de Contacto */}
            <div className="order-2 lg:order-1">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Send className="h-5 w-5 text-primary" />
                    Envíanos un mensaje
                  </CardTitle>
                  <CardDescription className="text-base">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">¡Mensaje enviado!</h3>
                      <p className="text-muted-foreground mb-4">
                        Gracias por contactarnos. Te responderemos en las próximas 24 horas.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                        className="text-sm"
                      >
                        Enviar otro mensaje
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre" className="text-sm font-medium">Nombre completo *</Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Tu nombre completo"
                            className="h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">Correo electrónico *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="tu@email.com"
                            className="h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefono" className="text-sm font-medium">Teléfono</Label>
                          <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            placeholder="+34 600 000 000"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="asunto" className="text-sm font-medium">Asunto *</Label>
                          <Select value={formData.asunto} onValueChange={handleSelectChange}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Selecciona un asunto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adopcion">Información sobre adopción</SelectItem>
                              <SelectItem value="voluntariado">Ser voluntario</SelectItem>
                              <SelectItem value="donacion">Donaciones</SelectItem>
                              <SelectItem value="visita">Visitar el refugio</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mensaje" className="text-sm font-medium">Mensaje *</Label>
                        <Textarea
                          id="mensaje"
                          name="mensaje"
                          value={formData.mensaje}
                          onChange={handleInputChange}
                          placeholder="Cuéntanos cómo podemos ayudarte..."
                          rows={5}
                          className="resize-none"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-medium" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Enviando...
                          </div>
                        ) : (
                          "Enviar mensaje"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Información de Contacto */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Información Principal */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl">Información de Contacto</CardTitle>
                  <CardDescription className="text-base">
                    Puedes contactarnos directamente o visitarnos en el refugio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Correo electrónico</p>
                      <p className="text-muted-foreground">info@rukayun.org</p>
                      <p className="text-xs text-muted-foreground mt-1">Respuesta en 24 horas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Teléfono</p>
                      <p className="text-muted-foreground">+34 600 000 000</p>
                      <p className="text-xs text-muted-foreground mt-1">Lun-Vie 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dirección</p>
                      <p className="text-muted-foreground">
                        Calle del Refugio, 123<br />
                        28001 Madrid, España
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Visitas con cita previa</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Horario de atención</p>
                      <p className="text-muted-foreground">
                        Lunes a Viernes: 9:00 - 18:00<br />
                        Sábados: 10:00 - 16:00<br />
                        Domingos: Cerrado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Razones para contactar */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl">¿Por qué contactarnos?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Adopción</p>
                      <p className="text-sm text-muted-foreground">
                        Conoce nuestros animales disponibles y el proceso de adopción.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Voluntariado</p>
                      <p className="text-sm text-muted-foreground">
                        Únete a nuestro equipo y ayuda a los animales necesitados.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Donaciones</p>
                      <p className="text-sm text-muted-foreground">
                        Tu apoyo es fundamental para mantener nuestro refugio.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-foreground">Visitas</p>
                      <p className="text-sm text-muted-foreground">
                        Ven a conocer nuestro refugio y los animales que cuidamos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 