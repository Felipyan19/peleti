# Resin Art Gallery - SPA

Una aplicación de página única (SPA) moderna para mostrar y vender piezas de arte en resina.

## Características

- Diseño moderno y responsivo
- Animaciones suaves con Framer Motion
- Galería de estilos filtrable
- Portafolio con modal de detalles
- Formulario de contacto integrado con EmailJS
- Optimizado para SEO
- Despliegue automático en Vercel

## Stack Tecnológico

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- EmailJS
- React Icons

## Requisitos Previos

- Node.js 18.0.0 o superior
- npm o yarn

## Configuración del Proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/resin-art-gallery.git
cd resin-art-gallery
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
resin-art-gallery/
├─ public/
│  └─ images/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ data/
│  ├─ content/
│  ├─ styles/
│  └─ utils/
├─ tailwind.config.ts
└─ package.json
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Despliegue

La aplicación está configurada para desplegarse automáticamente en Vercel cuando se hace push a la rama principal.

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. ¡Listo! Cada push a la rama principal desencadenará un nuevo despliegue

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@example.com

Link del Proyecto: [https://github.com/tu-usuario/resin-art-gallery](https://github.com/tu-usuario/resin-art-gallery)
