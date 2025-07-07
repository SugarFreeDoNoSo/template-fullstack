"use client";
import { useState, useMemo } from 'react';
import { useGetServices, useDeleteService } from '@/hooks/useServices';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { Service } from 'shared-types';

const PAGE_SIZE = 5;

export default function ServiceTable() {
  const { data: services = [], refetch } = useGetServices();
  const deleteMutation = useDeleteService();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return services.filter((s) =>
      [s.customerName, s.serviceType].some((field) =>
        field.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [services, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter services..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((service: Service) => (
            <TableRow key={service.id}>
              <TableCell>{service.customerName}</TableCell>
              <TableCell>{service.serviceType}</TableCell>
              <TableCell>
                {new Date(service.scheduledAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">${service.price.toFixed(2)}</TableCell>
              <TableCell>{service.status}</TableCell>
              <TableCell className="text-right">
                <ConfirmationModal
                  trigger={<Button variant="destructive">Delete</Button>}
                  onConfirm={async () => {
                    await deleteMutation.mutateAsync({ id: service.id });
                    refetch();
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {paginated.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No services found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={prevPage} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={nextPage}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
