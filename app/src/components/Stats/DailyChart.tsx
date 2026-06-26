import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyStats } from '../../utils/stats'

interface Props { data: DailyStats[] }

export function DailyChart({ data }: Props) {
  const chartData = data.map((d) => ({ label: d.label, 番茄数: d.count, 分钟: d.totalMinutes }))

  return (
    <div
      className="p-4 dark:bg-[var(--color-white)]"
      style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: 'var(--shadow-raised)' }}
    >
      <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">最近 7 天番茄数</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} stroke="#7F8C8D" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#7F8C8D" />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #D6DBE3', fontSize: '13px' }}
            formatter={(v, name) => [`${v} ${name === '番茄数' ? '个' : '分钟'}`, name]}
          />
          <Bar dataKey="番茄数" fill="#F25757" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
