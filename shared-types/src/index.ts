// Exportar todo desde shared-types
export * from './lib/shared-types';

// Exports específicos para mejor tree-shaking
export {
  createServiceSchema,
  Service,
  serviceResponseSchema,
  ServiceStatus,
  sharedTypes,
  updateServiceSchema,
  type CreateServiceDto,
  type ServiceResponseDto,
  type UpdateServiceDto,
} from './lib/shared-types';
