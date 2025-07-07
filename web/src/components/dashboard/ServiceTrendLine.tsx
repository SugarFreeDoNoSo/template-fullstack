"use client";
import { memo } from 'react';
import { useGetServices } from '@/hooks/useServices';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

function ServiceTrendLineComponent() {
  const { data: services = [] } = useGetServices();

  const today = new Date();
  const lastFive = Array.from({ length: 5 }).map((_, i) => subDays(today, 4 - i));
  const data = lastFive.map((date) => {
    const day = format(date, 'yyyy-MM-dd');
    const count = services.filter((s) => format(new Date(s.scheduledAt), 'yyyy-MM-dd') === day).length;
    return { day, count };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default memo(ServiceTrendLineComponent);
