import { useState, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'
import { load, save } from '../../utils/storage'
import { startNoise, stopNoise, setNoiseVolume, setNoiseType, isNoisePlaying } from '../../utils/whiteNoise'
import type { NoiseType } from '../../types'

const NOISE_OPTIONS: { type: NoiseType; label: string }[] = [
  { type: 'white', label: '白噪音' },
  { type: 'pink', label: '粉红噪音' },
  { type: 'brown', label: '棕色噪音' },
]

export function WhiteNoiseControl() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [type, setType] = useState<NoiseType>('white')
  const [volume, setVolume] = useState(0.3)

  // Sync state from settings on mount and when popover opens
  const syncSettings = useCallback(() => {
    const settings = load().settings
    setType(settings.whiteNoiseType)
    setVolume(settings.whiteNoiseVolume)
    setPlaying(settings.whiteNoiseEnabled && isNoisePlaying())
  }, [])

  useEffect(() => {
    syncSettings()
  }, [syncSettings])

  // Re-sync when popover opens (settings might have changed elsewhere)
  useEffect(() => {
    if (open) syncSettings()
  }, [open, syncSettings])

  const toggleNoise = () => {
    const data = load()
    if (playing) {
      stopNoise()
      data.settings.whiteNoiseEnabled = false
      setPlaying(false)
    } else {
      startNoise(type, volume)
      data.settings.whiteNoiseEnabled = true
      setPlaying(true)
    }
    save(data)
  }

  const handleTypeChange = (newType: NoiseType) => {
    const data = load()
    setType(newType)
    data.settings.whiteNoiseType = newType
    save(data)
    if (playing) {
      setNoiseType(newType)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    const data = load()
    setVolume(newVolume)
    data.settings.whiteNoiseVolume = newVolume
    save(data)
    if (playing) {
      setNoiseVolume(newVolume)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm transition-colors ${
          playing
            ? 'text-tomato hover:text-tomato-dark'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title={playing ? `${NOISE_OPTIONS.find(n => n.type === type)?.label} 播放中` : '白噪音'}
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-full mt-2 right-0 z-[60] bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-56"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">白噪音</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Toggle */}
            <button
              onClick={toggleNoise}
              className={`w-full py-2 px-3 text-sm rounded-lg font-medium transition-colors mb-3 ${
                playing
                  ? 'bg-tomato text-white hover:bg-tomato-dark'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {playing ? '关闭' : '开启'}
            </button>

            {/* Noise type selector */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              {NOISE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => handleTypeChange(opt.type)}
                  className={`px-2 py-1.5 text-xs rounded-lg transition-colors ${
                    type === opt.type
                      ? 'bg-tomato text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <VolumeX size={14} className="text-gray-400 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-1.5 accent-tomato cursor-pointer"
              />
              <Volume2 size={14} className="text-gray-400 shrink-0" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
