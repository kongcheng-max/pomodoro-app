import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DailyChart } from './DailyChart'
import { StreakCounter } from './StreakCounter'
import { computeStats, formatMinutes } from '../../utils/stats'
import { load } from '../../utils/storage'
import { Clock, CheckCircle, TrendingUp } from 'lucide-react'

const PIE_COLORS = ['#60a5fa', '#f59e0b', '#8b5cf6', '#6b7280']

export function Stats() {
  const data = useMemo(() => {
    const appData = load()
    return computeStats(appData.records, appData.streak)
  }, [])

  const pieData = [
    { name: '上午 6-12', value: data.timeDistribution.morning },
    { name: '下午 12-18', value: data.timeDistribution.afternoon },
    { name: '晚上 18-24', value: data.timeDistribution.evening },
    { name: '深夜 0-6', value: data.timeDistribution.night },
  ].filter((d) => d.value > 0)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-bold">📊 统计</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Clock size={20} className="text-tomato mb-2" />
          <div className="text-2xl font-bold">{data.todayPomodoros}</div>
          <div className="text-xs text-gray-500">今日番茄</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Clock size={20} className="text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{formatMinutes(data.todayMinutes)}</div>
          <div className="text-xs text-gray-500">今日专注</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <TrendingUp size={20} className="text-green-500 mb-2" />
          <div className="text-2xl font-bold">{data.totalPomodoros}</div>
          <div className="text-xs text-gray-500">累计番茄</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <CheckCircle size={20} className="text-purple-500 mb-2" />
          <div className="text-2xl font-bold">{Math.round(data.completionRate * 100)}%</div>
          <div className="text-xs text-gray-500">完成率</div>
        </div>
      </div>

      {/* Streak */}
      <StreakCounter streak={data.streak} />

      {/* Daily chart */}
      <DailyChart data={data.dailyStats} />

      {/* Time distribution pie chart */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">专注时段分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, entry) => [
                  formatMinutes(value as number),
                  entry.payload.name,
                ]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cumulative time */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">累计专注时长</h3>
        <div className="text-3xl font-bold text-[var(--color-text)]">
          {formatMinutes(data.totalMinutes)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          共完成 {data.totalPomodoros} 个番茄
        </div>
      </div>
    </div>
  )
}
