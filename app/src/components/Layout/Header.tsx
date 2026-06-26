import { useEffect } from 'react'
import { TodoStats } from '../TodoList/TodoStats'
import { load, save } from '../../utils/storage'
import { Moon, Sun, Download } from 'lucide-react'
import { usePwaInstall } from '../../hooks/usePwaInstall'

export function Header() {
  const settings = load().settings
  const { install, showGuide } = usePwaInstall()

  useEffect(() => {
    // Apply theme on mount and on change
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.theme])

  const toggleTheme = () => {
    const data = load()
    const newTheme = data.settings.theme === 'dark' ? 'light' : 'dark'
    data.settings.theme = newTheme
    save(data)

    // Force re-render by toggling class
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Trigger re-render via window event
    window.dispatchEvent(new Event('themechange'))
  }

  // Listen for theme changes
  useEffect(() => {
    const handler = () => {
      const data = load()
      const root = document.documentElement
      if (data.settings.theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md
                 border-b border-[var(--color-border)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 select-none">
          <span className="text-2xl">🍅</span>
          <span className="hidden sm:inline">极简番茄</span>
        </h1>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <TodoStats />
          <div className="relative">
            <button
              onClick={install}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-tomato text-white
                         rounded-full hover:bg-tomato-dark active:scale-95 transition-all"
              title="添加到主屏幕"
            >
              <Download size={14} />
              <span className="hidden sm:inline">安装</span>
            </button>
            {showGuide && (
              <div
                className="absolute top-full mt-2 right-0 z-[70] bg-white dark:bg-gray-800
                            border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 w-56 text-xs text-gray-500"
              >
                <p>在浏览器菜单中选择"<strong>添加到主屏幕</strong>"即可安装</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="切换主题"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  )
}
