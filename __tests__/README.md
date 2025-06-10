# Sistema de Testing para Peleti

Este proyecto utiliza **Jest** y **React Testing Library** para realizar tests automatizados.

## Estructura de Directorios

```
__tests__/
├── components/          # Tests para componentes React
│   ├── Hero.test.tsx
│   └── About.test.tsx
├── utils/              # Tests para funciones de utilidad
│   └── sendEmail.test.ts
├── example.test.ts     # Test básico de ejemplo
└── README.md          # Esta documentación
```

## Comandos Disponibles

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## Tipos de Tests Configurados

### 1. Tests de Componentes

- Verifican que los componentes se rendericen correctamente
- Comprueban que el contenido se muestre como esperado
- Validan la interacción con el usuario

### 2. Tests de Utilidades

- Prueban funciones auxiliares (como sendEmail)
- Verifican el manejo de errores
- Comprueban la lógica de negocio

### 3. Tests de Integración

- Pueden probar múltiples componentes trabajando juntos
- Verifican flujos completos de usuario

## Patrones de Testing Implementados

### Mocking de Dependencias

```typescript
// Mock de Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock de hooks personalizados
jest.mock("@/utils/useScrollToSection", () => ({
  useScrollToSection: jest.fn(() => ({
    ref: { current: null },
    shouldAnimate: true,
  })),
}));
```

### Helper para Material-UI

```typescript
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};
```

## Mejores Prácticas

1. **Nombres descriptivos**: Los tests deben describir claramente qué están probando
2. **Arrange, Act, Assert**: Organizar el test en estas tres fases
3. **Un concepto por test**: Cada test debe verificar una sola funcionalidad
4. **Usar data-testid** cuando sea necesario para elementos difíciles de encontrar
5. **Mockear dependencias externas** para tests más rápidos y confiables

## Ejemplos de Tests

### Test Básico de Renderizado

```typescript
it("renders the component correctly", () => {
  renderWithTheme(<MyComponent />);
  expect(screen.getByText("Expected Text")).toBeInTheDocument();
});
```

### Test de Interacción

```typescript
it("handles click events", async () => {
  const user = userEvent.setup();
  renderWithTheme(<MyComponent />);

  const button = screen.getByRole("button", { name: /click me/i });
  await user.click(button);

  expect(screen.getByText("Button clicked!")).toBeInTheDocument();
});
```

### Test de API/Función

```typescript
it("should handle successful API call", async () => {
  const mockData = { name: "Test", email: "test@example.com" };
  const result = await myFunction(mockData);

  expect(result).toBe(true);
});
```

## Configuración

El sistema está configurado con:

- **Jest**: Framework de testing
- **React Testing Library**: Para testing de componentes React
- **jsdom**: Entorno DOM para los tests
- **@types/jest**: Tipos de TypeScript para Jest

Los archivos de configuración principales son:

- `jest.config.js`: Configuración principal de Jest
- `jest.setup.js`: Configuración inicial para cada test

## Cobertura de Código

Para ver un reporte detallado de cobertura:

```bash
npm run test:coverage
```

Esto generará un reporte en la carpeta `coverage/` que puedes abrir en tu navegador.

## Troubleshooting

### Problemas comunes:

1. **Mock de Next.js Image**: Ya configurado para evitar errores de SSR
2. **Mock de Framer Motion**: Configurado para simplificar animaciones en tests
3. **Material-UI Theme**: Usar el helper `renderWithTheme` para componentes que usan MUI

### Tests que fallan:

- Verificar que todos los mocks estén correctamente configurados
- Asegurarse de que los imports sean correctos
- Revisar que las variables de entorno estén configuradas si es necesario
