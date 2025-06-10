# Peleti - Artesanías en Resina 🎨

Una aplicación web moderna desarrollada con Next.js para mostrar y promocionar artesanías únicas en resina. Peleti combina tradición y creatividad para transformar resina en arte, ofreciendo piezas únicas que cuentan historias.

## ✨ Características

- 🎨 **Diseño moderno y responsivo** con Tailwind CSS 4
- 🌊 **Animaciones fluidas** con Framer Motion y React Magic Motion
- 🖼️ **Galería de estilos filtrable** con categorías dinámicas
- 📱 **Portafolio interactivo** con modal de detalles
- 📧 **Formulario de contacto integrado** con EmailJS
- 🔍 **Optimizado para SEO** con Next.js App Router
- 🚀 **Despliegue automático** en Vercel
- 🧪 **Suite completa de testing** con Jest y React Testing Library
- ⚙️ **CI/CD automatizado** con GitHub Actions
- 🎭 **Interfaz con Material-UI** y React Icons
- 📊 **Gestión de estado** con React hooks
- 🎯 **Detección de scroll** con React Intersection Observer

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 15.3.3** (App Router)
- **React 19** con React DOM 19
- **TypeScript 5** para tipado estático
- **Tailwind CSS 4** para estilos
- **Framer Motion 12.16** para animaciones avanzadas
- **React Magic Motion 1.1** para transiciones

### UI/UX

- **Material-UI 5.15** (MUI Icons, Lab)
- **Emotion** (React & Styled)
- **React Icons 5.5** para iconografía
- **React Intersection Observer** para lazy loading

### Comunicación

- **EmailJS 4.4** para envío de formularios

### Testing & Calidad

- **Jest 30** como test runner
- **React Testing Library 16.3** para testing de componentes
- **Testing Library User Event 14.6** para simulación de interacciones
- **Jest Environment JSDOM** para DOM simulation
- **ESLint 9** con configuración Next.js

### DevOps & Deployment

- **GitHub Actions** para CI/CD
- **Vercel** para deployment automático
- **PostCSS** para procesamiento de CSS

## 📋 Requisitos Previos

- **Node.js** 18.0.0 o superior
- **npm** o **yarn**
- **Git** para control de versiones

## 🚀 Configuración del Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/peleti.git
cd peleti
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

### 5. Abrir en el navegador

Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
peleti/
├── .github/                    # Configuración GitHub Actions
│   ├── workflows/             # Workflows de CI/CD
│   └── PULL_REQUEST_TEMPLATE.md
├── __tests__/                 # Suite de pruebas
│   ├── components/           # Tests de componentes
│   └── utils/               # Tests de utilidades
├── public/                   # Archivos estáticos
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── page.tsx        # Página principal
│   │   ├── layout.tsx      # Layout global
│   │   ├── globals.css     # Estilos globales
│   │   └── favicon.ico     # Favicon
│   ├── components/          # Componentes React
│   │   ├── Hero.tsx        # Sección hero
│   │   ├── About.tsx       # Sección sobre nosotros
│   │   ├── StylesGallery.tsx # Galería de estilos
│   │   ├── WorkProcess.tsx # Proceso de trabajo
│   │   ├── Portfolio.tsx   # Portafolio de proyectos
│   │   ├── Contact.tsx     # Formulario de contacto
│   │   ├── Navbar.tsx      # Barra de navegación
│   │   ├── Footer.tsx      # Pie de página
│   │   └── ThemeRegistry.tsx # Configuración de Material-UI
│   ├── data/               # Datos JSON
│   │   ├── hero.json       # Contenido del hero
│   │   ├── about.json      # Información sobre la empresa
│   │   ├── portfolio.json  # Proyectos del portafolio
│   │   ├── workProcess.json # Pasos del proceso
│   │   ├── styleGallery.json # Galería de estilos
│   │   ├── styles.json     # Estilos disponibles
│   │   └── contact.json    # Información de contacto
│   ├── content/            # Contenido adicional
│   └── utils/              # Funciones utilitarias
├── coverage/               # Reportes de cobertura
├── jest.config.js         # Configuración de Jest
├── jest.setup.js          # Setup de Jest
├── tailwind.config.ts     # Configuración de Tailwind
├── tsconfig.json          # Configuración TypeScript
├── next.config.ts         # Configuración Next.js
├── postcss.config.mjs     # Configuración PostCSS
├── eslint.config.mjs      # Configuración ESLint
├── TESTING_GUIDE.md       # Guía completa de testing
└── package.json           # Dependencias y scripts
```

## 🎯 Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo con Turbopack
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
```

### Testing

```bash
npm test             # Ejecuta todos los tests
npm run test:watch   # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de cobertura
```

### Verificación completa

```bash
npm run lint && npm test && npm run build
```

## 🧪 Testing

El proyecto incluye una suite completa de testing configurada:

- **Jest** como test runner principal
- **React Testing Library** para testing de componentes
- **Mocks** configurados para Next.js, Framer Motion y Material-UI
- **Cobertura de código** con reportes detallados
- **Tests de ejemplo** para componentes y utilidades

Para más detalles, consulta la [Guía de Testing](TESTING_GUIDE.md).

## 🚀 CI/CD y Deployment

### GitHub Actions

- ✅ **Tests automáticos** en cada Pull Request
- ✅ **Build verification** y linting
- ✅ **Branch protection** configurado
- ✅ **Template de PR** con checklist

### Vercel Deployment

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard
3. ¡Listo! Cada push a `main` despliega automáticamente

## 🎨 Componentes Principales

### Hero

Sección principal con título, descripción y call-to-action.

### About

Historia y misión de Peleti con múltiples párrafos dinámicos.

### StylesGallery

Galería filtrable de diferentes estilos de artesanías.

### WorkProcess

Proceso de trabajo paso a paso con animaciones.

### Portfolio

Galería de proyectos con modal detallado y filtros.

### Contact

Formulario de contacto integrado con EmailJS.

## 📞 Contacto y Soporte

- **Email**: [tu-email@ejemplo.com]
- **Website**: [https://peleti.vercel.app]
- **GitHub**: [https://github.com/tu-usuario/peleti]

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crear** una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. **Escribir tests** para los nuevos cambios
4. **Commit** los cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
5. **Push** a la rama (`git push origin feat/nueva-funcionalidad`)
6. **Abrir** un Pull Request

### Flujo de contribución

- Todos los PRs deben pasar los tests automatizados
- Se requiere code review antes del merge
- Los tests de cobertura deben mantenerse arriba del 80%

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Peleti** - Transformando resina en arte, llevando inspiración y color a tu hogar. 🏠✨
