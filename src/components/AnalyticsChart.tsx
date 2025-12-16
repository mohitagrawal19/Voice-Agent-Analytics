import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { ChartData } from '../types'

interface ChartProps {
  title: string
  data: ChartData[]
  type: 'line' | 'bar' | 'pie'
  onEdit?: () => void
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const AnalyticsChart: React.FC<ChartProps> = ({ title, data, type, onEdit }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Edit
          </button>
        )}
      </div>
      {type === 'line' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {type === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}
      {type === 'pie' && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
