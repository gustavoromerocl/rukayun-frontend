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

### Estructura de Carpetas

```
rukayun-frontend/
├── public/                 # Archivos estáticos
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
│   └── index.css         # Estilos globales
├── package.json          # Dependencias y scripts
├── vite.config.ts        # Configuración de Vite
├── tailwind.config.ts    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── README.md            # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
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

- **Login simulado** con Microsoft provider
- **Persistencia de sesión** en localStorage
- **Protección de rutas** del dashboard
- **Logout funcional** con limpieza de estado

### Gestión de Animales

- **CRUD completo** con formularios validados
- **Carga de imágenes** con drag & drop
- **Tabla de datos** con filtros y paginación
- **Vista de detalles** con información completa
- **Estados de publicación** (publicado/privado)

### Dashboard de Estadísticas

- **Métricas clave** del refugio
- **Gráficos interactivos** con Recharts
- **Lista de adopciones recientes**
- **Datos mock** para demostración

### Formulario de Contacto

- **Validación en tiempo real**
- **Campos requeridos** y opcionales
- **Simulación de envío** con feedback
- **Información de contacto** completa

## 🎨 Sistema de Diseño

### Colores del Tema

- **Primario**: Azul oscuro (#1a365d)
- **Secundario**: Verde (#38a169)
- **Acentos**: Naranja (#ed8936)
- **Neutros**: Escala de grises personalizada

### Componentes UI

- **shadcn/ui** como base de componentes
- **Tailwind CSS** para estilos personalizados
- **Lucide React** para iconografía
- **Diseño responsive** con breakpoints estándar

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Rukayun
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Servidor de Producción

```bash
npm run preview
```

### Plataformas Recomendadas

- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Despliegue con funciones serverless
- **Railway**: Despliegue con base de datos incluida

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código

- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** para mensajes

## 📄 Licencia

## 👥 Equipo

- **Desarrollador Frontend**: Gustavo Romero
- **Desarrollador Backend**: Simón Salinas
- **Product Owner**: Alonso Castillo

## 📞 Contacto

- **Email**: info@rukayun.org
- **Website**: https://rukayun.org
- **GitHub**: https://github.com/rukayun
