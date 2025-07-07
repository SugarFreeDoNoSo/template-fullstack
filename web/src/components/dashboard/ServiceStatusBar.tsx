"use client";
import { memo } from 'react';
import { useGetServices } from '@/hooks/useServices';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

function ServiceStatusBarComponent() {
  const { data: services = [] } = useGetServices();
  const counts = {
    completed: services.filter((s) => s.status === 'completed').length,
    pending: services.filter((s) => s.status === 'pending').length,
    cancelled: services.filter((s) => s.status === 'cancelled').length,
  };
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default memo(ServiceStatusBarComponent);
