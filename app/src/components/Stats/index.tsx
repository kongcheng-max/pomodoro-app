import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DailyChart } from './DailyChart'
import { StreakCounter } from './StreakCounter'
import { computeStats, formatMinutes } from '../../utils/stats'
import { load } from '../../utils/storage'
import { Clock, CheckCircle, TrendingUp } from 'lucide-react'

const PIE_COLORS = ['#5DADE2', '#F39C12', '#A569BD', '#7F8C8D']

const CARD_STYLE: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 16,
  boxShadow: 'var(--shadow-raised)',
}
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

  const statCard = (icon: React.ReactNode, value: string, label: string) => (
    <div className="p-4 dark:bg-[var(--color-white)]" style={CARD_STYLE}>
      {icon}
      <div className="text-2xl font-bold text-[var(--color-text)] mt-1">{value}</div>
      <div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-bold text-[var(--color-text)]">📊 统计</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCard(<Clock size={20} className="text-tomato" />, String(data.todayPomodoros), '今日番茄')}
        {statCard(<Clock size={20} className="text-blue" />, formatMinutes(data.todayMinutes), '今日专注')}
        {statCard(<TrendingUp size={20} className="text-green" />, String(data.totalPomodoros), '累计番茄')}
        {statCard(<CheckCircle size={20} className="text-purple" />, `${Math.round(data.completionRate * 100)}%`, '完成率')}
      </div>

      <StreakCounter streak={data.streak} />
      <DailyChart data={data.dailyStats} />

      {pieData.length > 0 && (
        <div className="p-4 dark:bg-[var(--color-white)]" style={CARD_STYLE}>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">专注时段分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
              </Pie>
              <Tooltip
                formatter={(v, _, e) => [formatMinutes(v as number), e.payload.name]}
                contentStyle={{ borderRadius: '12px', border: '1px solid #D6DBE3', fontSize: '13px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 dark:bg-[var(--color-white)]" style={CARD_STYLE}>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">累计专注时长</h3>
        <div className="text-3xl font-bold text-[var(--color-text)]">{formatMinutes(data.totalMinutes)}</div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1">共完成 {data.totalPomodoros} 个番茄</div>
      </div>
    </div>
  )
}
