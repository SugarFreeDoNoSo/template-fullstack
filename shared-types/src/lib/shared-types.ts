import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { z } from 'zod';

// Enum para el estado del servicio
export enum ServiceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Entidad TypeORM Service
@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  customerName!: string;

  @Column({ type: 'varchar', length: 255 })
  serviceType!: string;

  @Column({ type: 'timestamp' })
  scheduledAt!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.PENDING,
  })
  status!: ServiceStatus;
}

// Schema Zod para crear un servicio (sin id)
export const createServiceSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(255),
  serviceType: z.string().min(1, 'Service type is required').max(255),
  scheduledAt: z.date(),
  price: z.number().positive('Price must be positive'),
  status: z.nativeEnum(ServiceStatus).default(ServiceStatus.PENDING),
});

// Schema Zod para actualizar un servicio (todos los campos opcionales)
export const updateServiceSchema = z.object({
  customerName: z.string().min(1).max(255).optional(),
  serviceType: z.string().min(1).max(255).optional(),
  scheduledAt: z.date().optional(),
  price: z.number().positive('Price must be positive').optional(),
  status: z.nativeEnum(ServiceStatus).optional(),
});

// Schema Zod para respuesta de servicio (con id)
export const serviceResponseSchema = z.object({
  id: z.number().int().positive(),
  customerName: z.string(),
  serviceType: z.string(),
  scheduledAt: z.date(),
  price: z.number(),
  status: z.nativeEnum(ServiceStatus),
});

// Tipos TypeScript derivados de los schemas Zod
export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
export type ServiceResponseDto = z.infer<typeof serviceResponseSchema>;

// Función legacy mantenida para compatibilidad
export function sharedTypes(): string {
  return 'shared-types';
}
