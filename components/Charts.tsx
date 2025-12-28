'use client';

import { Statistics } from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsProps {
  statistics: Statistics;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function Charts({ statistics }: ChartsProps) {
  return (
    <div className="space-y-8">
      {/* Citations by Year */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Yil bo'yicha sitatalar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statistics.citationsByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="citations"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Sitatalar"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Publications by Year */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Yil bo'yicha nashrlar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statistics.publicationsByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name="Nashrlar soni" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Citations by Type */}
      {statistics.citationsByType.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tur bo'yicha sitatalar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.citationsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const entry = statistics.citationsByType[props.index];
                  return `${entry.type}: ${(props.percent * 100).toFixed(0)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="type"
              >
                {statistics.citationsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

