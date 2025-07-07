"use client";
import { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  ServiceStatus,
  createServiceSchema,
  updateServiceSchema,
} from 'shared-types';
import { useCreateService, useUpdateService } from '@/hooks/useServices';

interface ServiceFormProps {
  initialData?: {
    id?: number;
    customerName?: string;
    serviceType?: string;
    scheduledAt?: Date | string;
    price?: number;
    status?: ServiceStatus;
  };
  onSuccess?: () => void;
}

export default function ServiceForm({ initialData, onSuccess }: ServiceFormProps) {
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    serviceType: initialData?.serviceType || '',
    scheduledAt:
      initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 10)
        : '',
    price: initialData?.price ? String(initialData.price) : '',
    status: initialData?.status || ServiceStatus.PENDING,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      customerName: formData.customerName,
      serviceType: formData.serviceType,
      scheduledAt: new Date(formData.scheduledAt),
      price: parseFloat(formData.price),
      status: formData.status as ServiceStatus,
    };
    const schema = initialData?.id ? updateServiceSchema : createServiceSchema;
    const result = schema.safeParse(payload);
    if (!result.success) {
      setErrors(result.error.errors.map((e) => e.message));
      return;
    }

    if (initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setErrors([]);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {errors.length > 0 && (
        <ul className="text-red-600 text-sm list-disc pl-5">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
      <div>
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="serviceType">Service Type</Label>
        <Input
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="scheduledAt">Scheduled At</Label>
        <Input
          id="scheduledAt"
          name="scheduledAt"
          type="date"
          value={formData.scheduledAt}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
        >
          {Object.values(ServiceStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full">
        {initialData?.id ? 'Update Service' : 'Create Service'}
      </Button>
    </form>
  );
}
