import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Layout/Header'
import { BottomNav } from './components/Layout/BottomNav'
import HomePage from './pages/HomePage'
import { load } from './utils/storage'

const StatsPage = lazy(() => import('./pages/StatsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-tomato border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(load().settings.theme)

  useEffect(() => {
    const handler = () => setTheme(load().settings.theme)
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full pb-4">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </Suspense>
      </main>

      <BottomNav />
    </div>
  )
}
