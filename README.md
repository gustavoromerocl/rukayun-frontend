# 🐾 Rukayun - Plataforma de Adopción de Animales

Rukayun es una plataforma web moderna para la gestión de adopciones de animales, desarrollada con React, TypeScript y Vite. La aplicación incluye un sitio público para mostrar animales disponibles y un dashboard administrativo para gestionar el refugio.

## ✨ Características Principales

### 🌐 Sitio Público

- **Página de inicio** con información del refugio y valores
- **Galería de animales** disponibles para adopción
- **Página de educación** sobre cuidado de mascotas
- **Formulario de contacto** funcional con validación
- **Navegación responsive** y diseño moderno
- **Modo oscuro/claro** con persistencia de preferencias

### 🏢 Dashboard Administrativo

- **Panel de resumen** con estadísticas y gráficos
- **Gestión de animales** (CRUD completo con imágenes)
- **Gestión de solicitudes** de adopción
- **Seguimiento post-adopción**
- **Perfil de usuario** y configuración
- **Sistema de autenticación** simulado

### 🎨 Diseño y UX

- **Diseño responsive** para todos los dispositivos
- **Componentes reutilizables** con shadcn/ui
- **Tema personalizado** con colores del refugio
- **Iconografía consistente** con Lucide React
- **Formularios intuitivos** con validación
- **Animaciones suaves** y micro-interacciones

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: React Router DOM 7
- **State Management**: Zustand
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Deployment**: AWS Amplify

### Estructura de Carpetas

```
rukayun-frontend/
├── public/                 # Archivos estáticos
│   └── _redirects         # Configuración de SPA routing
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes de shadcn/ui
│   │   ├── layout/        # Componentes de layout
│   │   └── charts/        # Componentes de gráficos
│   ├── pages/             # Páginas de la aplicación
│   │   ├── dashboard/     # Páginas del dashboard
│   │   └── ...           # Páginas públicas
│   ├── lib/              # Utilidades y configuración
│   │   ├── store.ts      # Estado global (Zustand)
│   │   └── utils.ts      # Funciones utilitarias
│   ├── assets/           # Recursos estáticos
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales y tema
├── package.json          # Dependencias y scripts
├── vite.config.ts        # Configuración de Vite
├── amplify.yml           # Configuración de AWS Amplify
├── tsconfig.json         # Configuración de TypeScript
└── README.md            # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 20+ (requerido para React Router 7)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd rukayun-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 📱 Funcionalidades Detalladas

### Sistema de Autenticación

- **Autenticación real** con Azure AD B2C usando MSAL
- **Login con Microsoft** mediante popup (sin recarga de página)
- **Gestión de sesión** automática por MSAL
- **Protección de rutas** del dashboard con RequireAuth
- **Logout funcional** con limpieza de sesión de MSAL
- **Roles de usuario** obtenidos desde claims de Azure AD B2C

### Gestión de Animales

- **CRUD completo** con formularios validados
- **Carga de imágenes** con drag & drop y preview
- **Tabla de datos** con filtros, ordenamiento y paginación
- **Vista de detalles** con información completa
- **Estados de publicación** (publicado/privado)
- **Validación de archivos** (tipo y tamaño)

### Dashboard de Estadísticas

- **Métricas clave** del refugio
- **Gráficos interactivos** con Recharts
- **Lista de adopciones recientes**
- **Datos mock** para demostración
- **Animaciones** en las tarjetas de estadísticas

### Gestión de Solicitudes

- **Tabla de solicitudes** con filtros
- **Estados de solicitud** (Pendiente, Aprobada, Rechazada)
- **Acciones de aprobación/rechazo**
- **Diálogos de confirmación**
- **Vista de detalles** de cada solicitud

### Formulario de Contacto

- **Validación en tiempo real**
- **Campos requeridos** y opcionales
- **Simulación de envío** con feedback
- **Información de contacto** completa
- **Diseño responsive** y accesible

## 🎨 Sistema de Diseño

### Colores del Tema

- **Primario**: Azul oscuro (#1a365d)
- **Secundario**: Verde (#38a169)
- **Acentos**: Naranja (#ed8936)
- **Neutros**: Escala de grises personalizada
- **Modo oscuro**: Paleta completa optimizada

### Componentes UI

- **shadcn/ui** como base de componentes
- **Tailwind CSS** para estilos personalizados
- **Lucide React** para iconografía
- **Diseño responsive** con breakpoints estándar
- **Tema personalizado** con variables CSS

## 🔧 Configuración de Desarrollo

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno para funcionar correctamente:

```env
# Host de la aplicación (requerido para MSAL)
VITE_APP_HOST=http://localhost:5173

# Para futuras integraciones con backend
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Rukayun
```

**Configuración de MSAL:**

- `VITE_APP_HOST`: Define la URL base de la aplicación para el redirectUri de MSAL
- En desarrollo: `http://localhost:5173`
- En producción: `https://tu-dominio.com`

**Crear archivo .env:**

```bash
cp .env.example .env
# Editar .env con los valores correctos para tu entorno
```

### Configuración de TypeScript

- **Configuración estricta** habilitada
- **Linting automático** en build
- **Tipos estrictos** para todos los componentes

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Despliegue en AWS Amplify

El proyecto está configurado para despliegue automático en AWS Amplify:

1. **Configuración de build** (`amplify.yml`):

   - Node.js 20 para compatibilidad con React Router 7
   - Build optimizado con Vite
   - Cache de dependencias

2. **Configuración de SPA** (`public/_redirects`):

   - Redirección de rutas para React Router
   - Manejo correcto de rutas del dashboard

3. **Optimizaciones**:
   - Build optimizado para producción
   - Compresión de assets
   - Cache de navegador

### Pasos para Despliegue

1. **Conectar repositorio** en AWS Amplify Console
2. **Configurar build settings** (ya incluidos en `amplify.yml`)
3. **Desplegar** automáticamente desde la rama main
4. **Configurar dominio personalizado** (opcional)

### Estado Actual del Despliegue

✅ **Build local exitoso** - Todos los errores de TypeScript resueltos
✅ **Configuración de Amplify** - Lista para despliegue
✅ **Optimizaciones aplicadas** - Build optimizado para producción

## 🐛 Solución de Problemas

### Errores Comunes

1. **Node.js version**: Requiere Node.js 20+ para React Router 7
2. **Dependencias**: Ejecutar `npm install` después de clonar
3. **Build errors**: Verificar que todos los imports estén correctos

### Correcciones Recientes

- ✅ Removidos imports no utilizados
- ✅ Corregidos errores de tipos en componentes
- ✅ Actualizada configuración de Node.js en Amplify
- ✅ Removida dependencia `tw-animate-css` no existente

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código

- **TypeScript estricto** para todos los archivos
- **Componentes funcionales** con hooks
- **shadcn/ui** para componentes de UI
- **Tailwind CSS** para estilos
- **Zustand** para estado global

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado como proyecto académico para la gestión de refugios de animales.

---

**Rukayun** - Conectando corazones, salvando vidas 🐾
