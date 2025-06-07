'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: any, name: string) => [
              name === 'revenue' ? formatCurrency(value) : value,
              name === 'revenue' ? 'Revenue' : 'Orders',
            ]}
          />
          <Legend />
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Revenue"
          />
          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
