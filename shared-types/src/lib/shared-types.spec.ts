import {
  createServiceSchema,
  Service,
  serviceResponseSchema,
  ServiceStatus,
  updateServiceSchema,
} from './shared-types';

describe('Service Entity', () => {
  it('should have correct TypeORM entity definition', () => {
    // Verificar que la entidad Service existe
    expect(Service).toBeDefined();

    // Verificar que es una función constructora
    expect(typeof Service).toBe('function');
    expect(Service.prototype).toBeDefined();
  });

  it('should create a service instance with correct properties', () => {
    const service = new Service();

    // Asignar valores para verificar que las propiedades se pueden establecer
    service.id = 1;
    service.customerName = 'Test Customer';
    service.serviceType = 'Test Service';
    service.scheduledAt = new Date();
    service.price = 100;
    service.status = ServiceStatus.PENDING;

    // Verificar que las propiedades se establecieron correctamente
    expect(service.id).toBe(1);
    expect(service.customerName).toBe('Test Customer');
    expect(service.serviceType).toBe('Test Service');
    expect(service.scheduledAt instanceof Date).toBe(true);
    expect(service.price).toBe(100);
    expect(service.status).toBe(ServiceStatus.PENDING);
  });

  it('should have correct property types', () => {
    const service = new Service();
    service.id = 1;
    service.customerName = 'John Doe';
    service.serviceType = 'Consultation';
    service.scheduledAt = new Date();
    service.price = 100.5;
    service.status = ServiceStatus.PENDING;

    expect(typeof service.id).toBe('number');
    expect(typeof service.customerName).toBe('string');
    expect(typeof service.serviceType).toBe('string');
    expect(service.scheduledAt instanceof Date).toBe(true);
    expect(typeof service.price).toBe('number');
    expect(typeof service.status).toBe('string');
  });
});

describe('Service Status Enum', () => {
  it('should have correct status values', () => {
    expect(ServiceStatus.PENDING).toBe('pending');
    expect(ServiceStatus.COMPLETED).toBe('completed');
    expect(ServiceStatus.CANCELLED).toBe('cancelled');
  });
});

describe('Zod Schemas', () => {
  describe('createServiceSchema', () => {
    it('should validate correct service creation data', () => {
      const validData = {
        customerName: 'John Doe',
        serviceType: 'Consultation',
        scheduledAt: new Date(),
        price: 100.5,
        status: ServiceStatus.PENDING,
      };

      const result = createServiceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid service creation data', () => {
      const invalidData = {
        customerName: '', // empty string should be invalid
        serviceType: 'Consultation',
        scheduledAt: 'invalid-date',
        price: -10, // negative price should be invalid
        status: 'invalid-status',
      };

      const result = createServiceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const incompleteData = {
        customerName: 'John Doe',
        // missing required fields
      };

      const result = createServiceSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateServiceSchema', () => {
    it('should validate partial service update data', () => {
      const validUpdateData = {
        customerName: 'Jane Doe',
        price: 150.0,
      };

      const result = updateServiceSchema.safeParse(validUpdateData);
      expect(result.success).toBe(true);
    });

    it('should allow empty update object', () => {
      const emptyUpdate = {};
      const result = updateServiceSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject invalid update data', () => {
      const invalidUpdateData = {
        price: -50, // negative price should be invalid
        status: 'invalid-status',
      };

      const result = updateServiceSchema.safeParse(invalidUpdateData);
      expect(result.success).toBe(false);
    });
  });

  describe('serviceResponseSchema', () => {
    it('should validate complete service response data', () => {
      const validResponseData = {
        id: 1,
        customerName: 'John Doe',
        serviceType: 'Consultation',
        scheduledAt: new Date(),
        price: 100.5,
        status: ServiceStatus.PENDING,
      };

      const result = serviceResponseSchema.safeParse(validResponseData);
      expect(result.success).toBe(true);
    });

    it('should reject response data without id', () => {
      const dataWithoutId = {
        customerName: 'John Doe',
        serviceType: 'Consultation',
        scheduledAt: new Date(),
        price: 100.5,
        status: ServiceStatus.PENDING,
      };

      const result = serviceResponseSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });
  });
});

describe('Exports', () => {
  it('should export Service entity', () => {
    expect(Service).toBeDefined();
  });

  it('should export ServiceStatus enum', () => {
    expect(ServiceStatus).toBeDefined();
  });

  it('should export Zod schemas', () => {
    expect(createServiceSchema).toBeDefined();
    expect(updateServiceSchema).toBeDefined();
    expect(serviceResponseSchema).toBeDefined();
  });
});
