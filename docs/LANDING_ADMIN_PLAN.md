# Landing + Administrador para Peleti

## Objetivo

Convertir `Peleti` en una landing page visualmente fuerte, optimizada para conversión, y conectada a un administrador que permita actualizar contenido sin tocar código.

La experiencia objetivo es:

- Una landing pública elegante, emocional y fácil de recorrer.
- Un catálogo/portafolio editable.
- Un panel admin para cambiar textos, imágenes, estados de publicación y productos.
- Un flujo simple para subir nuevas fotos, quitar productos y revisar mensajes de contacto.

## Hallazgos del estado actual

### Lo que ya existe

- Frontend en `Next.js 15 + React 19 + MUI + Framer Motion`.
- Modelo de datos en `Prisma` para:
  - `Hero`
  - `About`
  - `ContactSettings`
  - `ContactMessage`
  - `PortfolioCategory`
  - `PortfolioItem`
  - `PortfolioImage`
  - `StyleGallerySettings`
  - `StyleGalleryStyle`
  - `Style`
  - `WorkProcessSettings`
  - `WorkStep`
  - `User`
- API de login con JWT en `src/app/api/auth/login/route.ts`.
- Varias rutas CRUD para contenido, imágenes y portafolio.

### Gaps importantes

1. La landing pública sigue leyendo archivos locales `src/data/*.json`.
2. El backend editable existe, pero la web pública todavía no consume esa fuente.
3. No existe una interfaz `/admin` para gestionar contenido.
4. Hay inconsistencias de seguridad:
   - algunas rutas mutables no usan protección de auth;
   - hace falta endurecer permisos por rol `ADMIN`.
5. El diseño actual tiene buenas bases, pero aún se siente como una colección de secciones separadas, no como una dirección visual unificada.
6. SEO y metadata todavía están muy básicos.

## Visión de producto

### Landing pública

La landing debe transmitir:

- valor artesanal;
- confianza;
- personalización;
- calidad visual;
- facilidad para pedir una pieza o cotizar.

Secciones recomendadas:

1. `Hero`
   - mensaje fuerte;
   - imagen protagonista;
   - CTA a catálogo y CTA a contacto.
2. `Sobre Peleti`
   - historia breve;
   - proceso humano/artesanal;
   - foto con presencia.
3. `Colecciones o estilos`
   - categorías visuales;
   - técnica y materiales;
   - ejemplos claros.
4. `Cómo trabajamos`
   - proceso de compra/personalización.
5. `Productos destacados / catálogo`
   - filtro por categoría;
   - modal o ficha resumida;
   - estado publicado/no publicado.
6. `Prueba social`
   - testimonios o frases de clientes;
   - si no existen todavía, dejar el bloque preparado.
7. `Contacto`
   - formulario;
   - enlaces a WhatsApp, Instagram, Facebook.

### Administrador

El panel debe permitir:

- editar `hero`:
  - título;
  - descripción;
  - CTA;
  - imagen principal;
  - metadata SEO;
- editar `about`:
  - título;
  - párrafos;
  - imagen;
- editar bloques de:
  - estilos;
  - proceso;
  - contacto;
- administrar catálogo:
  - crear producto;
  - editar producto;
  - ocultar/publicar producto;
  - borrar producto;
  - subir múltiples fotos;
  - ordenar productos;
  - editar categorías y técnicas;
- revisar mensajes de contacto;
- administrar usuarios si el proyecto lo necesita.

## Arquitectura recomendada

### Regla principal

La landing pública debe dejar de depender de `src/data/*.json` y pasar a leer desde base de datos, con fallback opcional solo para desarrollo.

### Propuesta de capas

1. `src/lib/content/`
   - funciones server-side para leer contenido desde Prisma.
2. `src/app/page.tsx`
   - composición server component con datos ya resueltos.
3. `src/components/sections/*`
   - componentes presentacionales que reciben props tipadas.
4. `src/app/admin/*`
   - panel protegido por auth.
5. `src/app/api/*`
   - endurecido con auth y validación consistente.

### Dirección técnica

- Página pública:
  - `Server Components` para cargar contenido inicial.
  - Client components solo donde haya animación, filtros o interacción real.
- Admin:
  - interfaz cliente para edición;
  - envío a rutas API existentes o server actions nuevas;
  - preview de imágenes antes de guardar.

## Prioridades de implementación

### Fase 1

- Mejorar la landing visualmente.
- Unificar tipografía, color, ritmo visual y scroll effects.
- Mejorar metadata básica y estructura.
- Eliminar dependencias visuales rotas o inconsistentes.

### Fase 2

- Conectar la landing pública a Prisma/API.
- Crear una capa única de lectura de contenido.
- Mantener fallback a JSON si la base aún no tiene datos.

### Fase 3

- Crear `/admin/login`.
- Crear `/admin`.
- Formularios para editar:
  - hero;
  - about;
  - styles;
  - work process;
  - contact settings;
  - portfolio items;
  - portfolio images.

### Fase 4

- Endurecer seguridad:
  - exigir auth en mutaciones;
  - validar rol `ADMIN`;
  - revisar subida de imágenes;
  - normalizar validaciones.

## Requisitos funcionales del admin

### Gestión de productos

- Crear producto con:
  - nombre;
  - slug;
  - descripción;
  - dimensiones;
  - categoría;
  - técnicas;
  - orden;
  - estado publicado.
- Subir varias imágenes por producto.
- Eliminar imágenes.
- Reordenar imágenes.
- Ocultar productos temporalmente sin borrarlos.

### Gestión de contenido

- Editar textos sin tocar código.
- Cambiar imágenes principales por sección.
- Activar/desactivar publicaciones.
- Editar campos SEO básicos.

### Gestión comercial

- Ver mensajes recibidos.
- Marcar mensajes como leídos o archivados.

## Riesgos actuales a resolver

1. Doble fuente de verdad: JSON en frontend y DB/API en backend.
2. Mutaciones sin auth consistente.
3. Metadata global muy genérica.
4. Algunas decisiones visuales no reflejan todavía una identidad premium/artesanal definida.
5. El navbar usa una imagen que no parece existir en `public/images`, lo que puede romper branding visual.

## Criterio de éxito

Consideraremos esta evolución exitosa cuando:

- la landing se vea claramente más premium, coherente y memorable;
- el contenido principal se pueda cambiar desde admin;
- se puedan subir o quitar productos y fotos sin editar archivos;
- el catálogo público refleje esos cambios;
- el panel tenga seguridad mínima por rol;
- SEO, accesibilidad y rendimiento queden en mejor estado que hoy.

## Siguiente paso recomendado

Implementar primero la mejora de la landing pública y, en paralelo, preparar la base para conectar esa misma UI a contenido administrable.
