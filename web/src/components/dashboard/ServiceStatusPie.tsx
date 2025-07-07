"use client";
import { memo } from 'react';
import { useGetServices } from '@/hooks/useServices';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

function ServiceStatusPieComponent() {
  const { data: services = [] } = useGetServices();
  const counts = {
    completed: services.filter((s) => s.status === 'completed').length,
    pending: services.filter((s) => s.status === 'pending').length,
    cancelled: services.filter((s) => s.status === 'cancelled').length,
  };
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default memo(ServiceStatusPieComponent);
