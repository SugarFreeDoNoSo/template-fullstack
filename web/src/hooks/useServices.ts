'use client';
import { trpc } from '../trpc/client';

export const useGetServices = () => trpc.getServices.useQuery();
export const useCreateService = () => trpc.createService.useMutation();
export const useUpdateService = () => trpc.updateService.useMutation();
export const useDeleteService = () => trpc.deleteService.useMutation();
