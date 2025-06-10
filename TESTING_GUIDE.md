# 🧪 Guía Completa de Testing y CI/CD - Peleti

## ✅ Lo que ya está configurado

### 🛠️ Sistema de Testing

- ✅ Jest + React Testing Library
- ✅ Configuración completa de TypeScript
- ✅ Mocks para Next.js, Framer Motion y Material-UI
- ✅ Tests de ejemplo funcionando
- ✅ Scripts de NPM configurados

### 🚀 CI/CD con GitHub Actions

- ✅ Workflow para ejecutar tests en PR
- ✅ Workflow para verificar build y lint
- ✅ Template de Pull Request
- ✅ Documentación completa

## 📋 Pasos para activar CI/CD en GitHub

### 1. Subir los archivos al repositorio

```bash
# Agregar todos los archivos de configuración
git add .github/
git add jest.config.js jest.setup.js
git add __tests__/
git add TESTING_GUIDE.md

# Hacer commit
git commit -m "feat: add testing and CI/CD configuration

- Configure Jest with React Testing Library
- Add test examples for Hero, About, and sendEmail
- Set up GitHub Actions workflows for PR testing
- Add PR template with testing checklist
- Add comprehensive documentation"

# Subir a GitHub
git push origin main
```

### 2. Configurar protección de rama en GitHub

1. **Ve a tu repositorio en GitHub**
2. **Settings** → **Branches**
3. **Add rule** para la rama `main`
4. **Configurar las siguientes opciones:**
   - ✅ `Require a pull request before merging`
   - ✅ `Require status checks to pass before merging`
   - ✅ `Require branches to be up to date before merging`
   - ✅ En "Status checks": buscar y seleccionar:
     - `Run Tests`
     - `Build and Lint`
   - ✅ `Require conversation resolution before merging`
   - ✅ `Include administrators`

### 3. Probar el sistema

```bash
# Crear una nueva rama
git checkout -b test-ci-cd

# Hacer un cambio mínimo (ejemplo: añadir comentario)
echo "// Test CI/CD" >> src/components/Hero.tsx

# Commit y push
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin test-ci-cd
```

4. **Crear PR en GitHub** y verificar que:
   - Se ejecutan automáticamente los workflows
   - Aparecen los checks en el PR
   - No se puede mergear hasta que pasen todos los tests

## 🎯 Comandos útiles

```bash
# Ejecutar tests localmente
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Verificar linting
npm run lint

# Verificar build
npm run build

# Ejecutar todo lo que hará CI/CD
npm run lint && npm test && npm run build
```

## 📊 Estructura de archivos

```
peleti/
├── .github/
│   ├── workflows/
│   │   ├── test-on-pr.yml       # Tests en PR
│   │   ├── build-check.yml      # Build y lint
│   │   └── pr-tests.yml         # Tests avanzados
│   ├── PULL_REQUEST_TEMPLATE.md # Template de PR
│   └── README.md                # Docs de CI/CD
├── __tests__/
│   ├── components/
│   │   ├── Hero.test.tsx        # Test del Hero
│   │   └── About.test.tsx       # Test del About
│   ├── utils/
│   │   └── sendEmail.test.ts    # Test de sendEmail
│   ├── example.test.ts          # Test básico
│   └── README.md                # Docs de testing
├── jest.config.js               # Configuración Jest
├── jest.setup.js                # Setup de Jest
└── TESTING_GUIDE.md            # Esta guía
```

## 🔄 Flujo de trabajo con CI/CD

### Para desarrolladores:

1. **Crear rama para nueva feature:**

   ```bash
   git checkout -b feat/nueva-funcionalidad
   ```

2. **Desarrollar y escribir tests:**

   ```bash
   # Escribir código
   # Escribir tests correspondientes
   npm test  # Verificar que pasan
   ```

3. **Commit y push:**

   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad con tests"
   git push origin feat/nueva-funcionalidad
   ```

4. **Crear Pull Request:**

   - GitHub automáticamente ejecuta tests
   - Revisar que todos los checks pasen ✅
   - Solicitar code review

5. **Mergear solo si:**
   - ✅ Todos los tests pasan
   - ✅ Build exitoso
   - ✅ Code review aprobado
   - ✅ No hay conflictos

### Para reviewers:

1. **Verificar automáticamente:**

   - ✅ Tests pasando
   - ✅ Build exitoso
   - ✅ Coverage adecuado

2. **Revisar manualmente:**
   - Calidad del código
   - Tests apropiados
   - Documentación actualizada

## 🚨 Troubleshooting

### Tests fallan en CI pero pasan localmente:

- Verificar versión de Node.js
- Verificar variables de entorno
- Verificar diferencias entre sistemas operativos

### Workflow no se ejecuta:

- Verificar que los archivos estén en `.github/workflows/`
- Verificar sintaxis YAML
- Verificar que el repositorio tenga Actions habilitado

### PR no se puede mergear:

- Verificar que todos los status checks pasen
- Verificar configuración de branch protection
- Verificar permisos del repositorio

### ⚠️ Error "Resource not accessible by integration":

**Problema:** El workflow no puede comentar en PRs

**Causa:** Falta de permisos para escribir comentarios

**Solución:** ✅ **Ya corregido** - Agregamos permisos en todos los workflows:

```yaml
permissions:
  pull-requests: write
  contents: read
```

**Si persiste el error:**

- Verificar que el repositorio tenga GitHub Actions habilitado
- Verificar que no haya restricciones en la organización
- El workflow continúa funcionando aunque no pueda comentar (tests siguen validándose)

## 📈 Métricas y monitoreo

### En GitHub:

- **Actions tab:** Historial de todas las ejecuciones
- **Insights → Pulse:** Actividad de PRs y merges
- **Settings → Branches:** Reglas de protección activas

### Reportes de cobertura:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🎉 Beneficios obtenidos

1. **Calidad garantizada:** No se puede mergear código que rompe tests
2. **Feedback inmediato:** Notificación instantánea de problemas
3. **Automatización completa:** Sin intervención manual
4. **Historial completo:** Registro de todas las validaciones
5. **Colaboración mejorada:** Process claro para todos los desarrolladores
6. **Confianza en deploys:** Código validado automáticamente

## 🚀 Próximos pasos

1. **Añadir más tests** para componentes faltantes
2. **Configurar Codecov** para tracking de cobertura
3. **Añadir tests E2E** con Playwright/Cypress
4. **Deploy automático** a staging cuando se mergea a main
5. **Notifications** en Slack/Discord para el equipo

¡Ya tienes un sistema de CI/CD profesional configurado! 🎊
