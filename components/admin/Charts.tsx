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
  PieLabelRenderProps,
} from 'recharts';

interface ChartsProps {
  statistics: Statistics;
}

const COLORS = ['#2563EB', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function Charts({ statistics }: ChartsProps) {
  return (
    <div className="space-y-8">
      {/* Yil bo'yicha sitatalar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Yil bo&apos;yicha sitatalar
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statistics.citationsByYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="citations"
              stroke="#2563EB"
              strokeWidth={2}
              name="Sitatalar"
              dot={{ fill: '#2563EB' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Yil bo'yicha nashrlar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Yil bo&apos;yicha nashrlar
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statistics.publicationsByYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#10b981"
              name="Nashrlar soni"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tur bo'yicha sitatalar */}
      {statistics.citationsByType.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Tur bo&apos;yicha sitatalar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.citationsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: PieLabelRenderProps) => {
                  const index = props.index ?? 0;
                  const percent = props.percent ?? 0;
                  const entry = statistics.citationsByType[index];
                  if (!entry) return '';
                  return `${entry.type}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="type"
              >
                {statistics.citationsByType.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
