# CI/CD Configuration

Este directorio contiene la configuración de **GitHub Actions** para automatizar tests y validaciones en Pull Requests.

## Workflows Configurados

### 1. 🧪 Test on Pull Request (`test-on-pr.yml`)

- **Trigger:** Cuando se abre/actualiza un PR hacia `main`, `master` o `develop`
- **Acciones:**
  - Instala dependencias
  - Ejecuta todos los tests
  - Genera reporte de cobertura
  - Comenta en el PR si los tests pasan

### 2. 🏗️ Build Check (`build-check.yml`)

- **Trigger:** Push y PR hacia ramas principales
- **Acciones:**
  - Ejecuta ESLint
  - Verifica que el proyecto compile (`npm run build`)

### 3. 📊 PR Tests (`pr-tests.yml`)

- **Trigger:** PR hacia ramas principales
- **Acciones:**
  - Tests en múltiples versiones de Node.js (18.x, 20.x)
  - Incluye integración con Codecov para coverage

## 🚀 Cómo Funciona

1. **Cuando haces un PR:**

   ```bash
   git checkout -b mi-nueva-feature
   # Haces tus cambios...
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin mi-nueva-feature
   # Abres PR en GitHub
   ```

2. **GitHub Actions automáticamente:**

   - ✅ Ejecuta todos los tests
   - ✅ Verifica que el código compile
   - ✅ Ejecuta el linter (ESLint)
   - ✅ Genera reporte de cobertura
   - ✅ Comenta en el PR con los resultados

3. **El PR no se puede mergear si:**
   - ❌ Algún test falla
   - ❌ El código no compila
   - ❌ Hay errores de linting

## 📋 Template de PR

Se incluye un template en `PULL_REQUEST_TEMPLATE.md` que:

- Guía al desarrollador sobre qué información incluir
- Incluye checklist que menciona tests
- Facilita el proceso de code review

## 🔧 Configuración en GitHub

Para habilitar la protección de rama:

1. Ve a **Settings** → **Branches** en tu repositorio
2. Añade una regla para `main`/`master`:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Selecciona los checks: `Run Tests`, `Build and Lint`
   - ✅ Require conversation resolution before merging

## 🎯 Comandos Útiles

```bash
# Ejecutar tests localmente antes del PR
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Verificar linting
npm run lint

# Verificar que compila
npm run build
```

## 🔍 Monitoreo

- **GitHub Actions tab:** Ver el estado de todos los workflows
- **PR checks:** Ver directamente en el PR si pasan las validaciones
- **Comentarios automáticos:** El bot comenta cuando los tests pasan

## 📈 Beneficios

1. **Calidad asegurada:** Nunca se mergea código que rompe tests
2. **Feedback inmediato:** Sabes al instante si tu código tiene problemas
3. **Proceso automatizado:** No dependes de que alguien recuerde ejecutar tests
4. **Historial completo:** Registro de todas las ejecuciones de tests
5. **Multiple Node versions:** Compatibilidad garantizada
