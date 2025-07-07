"use client";
import { useGetServices } from '@/hooks/useServices';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function KPIStats() {
  const { data: services = [] } = useGetServices();
  const total = services.length;
  const completed = services.filter((s) => s.status === 'completed').length;
  const pending = services.filter((s) => s.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
        </CardContent>
      </Card>
    </div>
  );
}
