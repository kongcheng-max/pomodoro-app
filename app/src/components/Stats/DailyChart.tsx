import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyStats } from '../../utils/stats'

interface Props {
  data: DailyStats[]
}

export function DailyChart({ data }: Props) {
  const chartData = data.map((d) => ({
    label: d.label,
    番茄数: d.count,
    分钟: d.totalMinutes,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-3">最近 7 天番茄数</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            className="text-gray-400"
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            className="text-gray-400"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
            }}
            formatter={(value, name) => [`${value} ${name === '番茄数' ? '个' : '分钟'}`, name]}
          />
          <Bar dataKey="番茄数" fill="#E74C3C" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
