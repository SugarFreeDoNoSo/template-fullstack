# Tarea 8: Configurar tRPC client en Frontend NextJS

## 📋 Información General
- **ID**: tarea_08_trpc_client
- **Estado**: DONE
- **Fecha de inicio**: 2024-01-XX
- **Fecha de finalización**: 2024-01-XX
- **Tiempo estimado**: 4 horas
- **Tiempo real**: 4 horas

## 🎯 Objetivo
Configurar el cliente tRPC en la aplicación NextJS con React Query, crear hooks personalizados para operaciones CRUD, implementar manejo de errores y loading states, y establecer la comunicación tipo-segura con el backend.

## 📝 Descripción
Instalar y configurar tRPC client con React Query en NextJS, crear un provider personalizado para la aplicación, implementar hooks reutilizables para cada procedure CRUD, configurar manejo avanzado de errores y estados de carga, y agregar utilidades para manejo de fechas.

## ✅ Criterios de Aceptación
- [x] Dependencias tRPC client y React Query instaladas
- [x] Provider tRPC configurado en app layout de NextJS
- [x] Cliente tRPC configurado con endpoint correcto
- [x] Hooks personalizados creados para procedures CRUD
- [x] Manejo de errores tipado implementado
- [x] Loading states configurados correctamente
- [x] Optimistic updates implementados donde aplicable
- [x] Cache invalidation automática configurada
- [x] Utilidades date-fns integradas para manejo de fechas
- [x] Type safety end-to-end verificado

## 🔧 Herramientas Principales
- **Principal**: `edit_file`
- **Secundarias**: `terminal`, `create_directory`

## 📦 Recursos Necesarios
- @trpc/client - Cliente tRPC para frontend
- @trpc/next - Adaptador tRPC para NextJS
- @trpc/react-query - Integración con React Query
- @tanstack/react-query - Estado y cache management
- superjson - Serialización consistente con backend
- date-fns - Utilidades para manejo de fechas
- Tipos compartidos de trpc-config

## 🧪 Pasos de Verificación
1. Ejecutar `npx nx dev web` sin errores
2. Verificar que provider tRPC está configurado correctamente
3. Probar hooks CRUD desde componentes de prueba
4. Confirmar type safety en todas las operaciones
5. Verificar manejo de errores con casos edge
6. Validar loading states durante operaciones
7. Probar cache invalidation automática
8. Confirmar optimistic updates funcionan
9. Verificar transformación de fechas con date-fns

## 🔗 Dependencias
- Tarea 1: DevContainer configurado
- Tarea 2: NX Workspace creado
- Tarea 4: NextJS con shadcn configurado
- Tarea 6: tRPC router implementado

## 📋 Dependencias Bloqueantes
- Ninguna

## 🎯 Resultados Obtenidos
- Cliente tRPC completamente funcional
- Type safety end-to-end garantizado
- Hooks CRUD listos para usar en componentes
- Sistema de cache optimizado con React Query
- Manejo de errores robusto y tipado
- Loading states automáticos
- Utilidades de fechas integradas
- Base sólida para componentes de UI

## 📊 Archivos Creados/Modificados
- `web/src/lib/trpc.ts` - Configuración cliente tRPC
- `web/src/providers/trpc-provider.tsx` - Provider React Query + tRPC
- `web/src/app/layout.tsx` - Integración del provider
- `web/src/hooks/useServices.ts` - Hooks personalizados CRUD
- `web/src/lib/utils/date.ts` - Utilidades date-fns
- `web/src/types/api.ts` - Tipos para respuestas API
- `web/src/components/ui/error-boundary.tsx` - Manejo de errores
- `package.json` - Dependencias tRPC y React Query

## 🔄 Commit
- **Hash**: `f02641a`
- **Mensaje**: `feat: configure trpc client and add date utils`

## 📚 Documentación
- `docs/iteraciones/tarea_8_iteracion_1.md` - Documentación detallada de la implementación
- README.md actualizado con configuración de cliente

## 🎓 Aprendizajes
- Configuración de tRPC client en NextJS 15
- Integración React Query con tRPC para estado global
- Implementación de optimistic updates
- Patrones de error handling en frontend
- Cache invalidation strategies con React Query
- Type inference avanzado de TypeScript
- Utilidades date-fns para manipulación de fechas

## 🔧 Notas Técnicas
- tRPC client configurado con superjson transformer
- React Query con staleTime optimizado para UX
- Error boundary para manejo graceful de errores
- Hooks personalizados con tipos inferidos automáticamente
- Cache invalidation automática en mutations
- Optimistic updates para mejor UX
- Date transformations consistentes con backend

## 🛠️ Configuración tRPC Client
```typescript
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      },
    };
  },
});
```

## 🪝 Hooks Personalizados
```typescript
export const useServices = () => {
  const utils = trpc.useContext();
  
  const { data: services, isLoading } = trpc.getServices.useQuery();
  
  const createService = trpc.createService.useMutation({
    onSuccess: () => {
      utils.getServices.invalidate();
    },
  });
  
  const updateService = trpc.updateService.useMutation({
    onSuccess: () => {
      utils.getServices.invalidate();
    },
  });
  
  const deleteService = trpc.deleteService.useMutation({
    onSuccess: () => {
      utils.getServices.invalidate();
    },
  });
  
  return {
    services,
    isLoading,
    createService,
    updateService,
    deleteService,
  };
};
```

## 📅 Utilidades de Fechas
```typescript
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Fecha inválida';
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Fecha inválida';
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
};
```

## 🎯 Error Handling
```typescript
export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h2>Algo salió mal</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>Reintentar</button>
        </div>
      )}
    >
      {children}
    </QueryErrorBoundary>
  );
};
```
