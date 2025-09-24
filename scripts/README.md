# 🌱 Peleti Database Seeder

Scripts para migrar los datos mockup de `src/data/*.json` a la base de datos PostgreSQL usando Prisma.

## 🚀 Instalación

```bash
cd scripts
npm install
```

## 📦 Uso

### Migrar todos los datos

```bash
# Opción 1: Desde la carpeta scripts
npm run seed

# Opción 2: Desde la raíz del proyecto
node scripts/seedAll.js
```

### Comandos individuales

```bash
# Migrar datos específicos
npm run seed:hero          # Solo Hero
npm run seed:about         # Solo About
npm run seed:contact       # Solo Contact
npm run seed:portfolio     # Solo Portfolio
npm run seed:styles        # Solo Styles
npm run seed:stylegallery  # Solo StyleGallery
npm run seed:workprocess   # Solo WorkProcess

# Utilidades
npm run clear              # Limpiar toda la BD
npm run stats              # Ver estadísticas
```

## 📋 Datos migrados

| Mockup JSON | Tabla(s) de BD | Estado |
|-------------|---------------|--------|
| `hero.json` | `Hero` | ✅ |
| `about.json` | `About` | ✅ |
| `contact.json` | `ContactSettings` + `SocialLink` | ✅ |
| `portfolio.json` | `PortfolioCategory` + `TechniqueTag` + `PortfolioItem` + `PortfolioImage` | ✅ |
| `styleGallery.json` | `StyleGallerySettings` + `StyleGalleryStyle` | ✅ |
| `styles.json` | `Style` | ✅ |
| `workProcess.json` | `WorkProcessSettings` + `WorkStep` | ✅ |

## 🔧 Funcionalidades

### 🖼️ Conversión de imágenes
- Convierte automáticamente paths de imágenes (`/images/art.jpg`) a base64
- Detecta el tipo MIME automáticamente
- Usa imagen por defecto si no encuentra el archivo

### 🏷️ Creación automática de relaciones
- Extrae categorías únicas del portfolio y las crea como `PortfolioCategory`
- Extrae técnicas únicas y las crea como `TechniqueTag`
- Crea slugs automáticamente para URLs amigables

### 📊 Estadísticas
- Muestra conteo de registros creados
- Tiempo de ejecución
- Errores detallados

## 📁 Estructura

```
scripts/
├── migrations/           # Scripts individuales
│   ├── seedHero.js
│   ├── seedAbout.js
│   ├── seedContact.js
│   ├── seedPortfolio.js
│   ├── seedStyleGallery.js
│   ├── seedStyles.js
│   └── seedWorkProcess.js
├── utils/
│   └── imageConverter.js # Utilidad para convertir imágenes
├── seedAll.js           # Script principal
├── package.json
└── README.md
```

## ⚠️ Requisitos previos

1. **Base de datos configurada**:
   ```bash
   npx prisma migrate dev
   ```

2. **Variables de entorno**:
   ```env
   DATABASE_URL="postgresql://..."
   ```

3. **Prisma Client generado**:
   ```bash
   npx prisma generate
   ```

4. **Imágenes en `public/images/`**:
   - Las imágenes referenciadas en los JSON deben existir
   - Si no existen, se usa una imagen por defecto

## 🛠️ Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
cd .. && npx prisma generate
```

### Error: "Image not found"
- Verifica que las imágenes estén en `public/images/`
- El seeder continuará con imagen por defecto

### Error: "Database connection failed"
- Verifica `DATABASE_URL` en `.env`
- Asegúrate que la BD esté corriendo

## 📝 Ejemplo de ejecución

```bash
$ npm run seed

🌱 Starting complete database seeding...

📦 Seeding Hero...
✅ Imagen convertida: /images/art.jpg (image/jpeg)
✅ Hero data seeded successfully
   - ID: 123e4567-e89b-12d3-a456-426614174000
   - Title: Peleti – Artesanías en Resina
✅ Hero completed

📦 Seeding About...
# ... más output

🎉 Database seeding completed successfully!
⏱️  Total time: 2.3s

📊 Database Statistics:
========================================
Hero entries: 1
About entries: 1
Contact Settings: 1
Social Links: 3
Portfolio Categories: 4
Portfolio Items: 8
Portfolio Images: 8
Technique Tags: 8
StyleGallery Settings: 1
StyleGallery Styles: 3
Styles: 4
WorkProcess Settings: 1
Work Steps: 5
========================================
```