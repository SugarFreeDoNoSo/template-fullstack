"use client";
import { Service } from "shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { useDeleteService } from "@/hooks/useServices";

interface ServiceCardProps {
  service: Service;
  onDeleted?: () => void;
}

export default function ServiceCard({ service, onDeleted }: ServiceCardProps) {
  const deleteMutation = useDeleteService();
  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: service.id });
    onDeleted?.();
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{service.customerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Type: {service.serviceType}</p>
        <p>Date: {new Date(service.scheduledAt).toLocaleDateString()}</p>
        <p>Status: {service.status}</p>
        <div className="flex justify-end">
          <ConfirmationModal trigger={<Button variant="destructive">Delete</Button>} onConfirm={handleDelete} />
        </div>
      </CardContent>
    </Card>
  );
}
