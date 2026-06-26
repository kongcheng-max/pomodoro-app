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

  const syncSettings = useCallback(() => {
    const settings = load().settings
    setType(settings.whiteNoiseType)
    setVolume(settings.whiteNoiseVolume)
    setPlaying(settings.whiteNoiseEnabled && isNoisePlaying())
  }, [])

  useEffect(() => { syncSettings() }, [syncSettings])
  useEffect(() => { if (open) syncSettings() }, [open, syncSettings])

  const toggleNoise = () => {
    const data = load()
    if (playing) { stopNoise(); data.settings.whiteNoiseEnabled = false; setPlaying(false) }
    else { startNoise(type, volume); data.settings.whiteNoiseEnabled = true; setPlaying(true) }
    save(data)
  }

  const handleTypeChange = (t: NoiseType) => {
    const data = load(); setType(t); data.settings.whiteNoiseType = t; save(data)
    if (playing) setNoiseType(t)
  }

  const handleVolumeChange = (v: number) => {
    const data = load(); setVolume(v); data.settings.whiteNoiseVolume = v; save(data)
    if (playing) setNoiseVolume(v)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm transition-colors ${
          playing ? 'text-tomato hover:text-tomato-dark' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
        }`}
        title={playing ? `${NOISE_OPTIONS.find(n => n.type === type)?.label} 播放中` : '白噪音'}
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-2 right-0 z-[60] rounded-2xl p-4 w-56 popover-in"
            style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-raised)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">白噪音</span>
              <button onClick={() => setOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                <X size={16} />
              </button>
            </div>

            <button
              onClick={toggleNoise}
              className={`w-full py-2 px-3 text-sm rounded-xl font-medium transition-colors mb-3 ${
                playing ? 'bg-tomato text-white hover:bg-tomato-dark' : 'text-[var(--color-text-secondary)]'
              }`}
              style={!playing ? { boxShadow: 'var(--shadow-recessed)', background: 'var(--color-bg)' } : {}}
            >
              {playing ? '关闭' : '开启'}
            </button>

            <div className="grid grid-cols-3 gap-1 mb-3">
              {NOISE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => handleTypeChange(opt.type)}
                  className={`px-2 py-1.5 text-xs rounded-xl transition-colors ${
                    type === opt.type ? 'bg-tomato text-white' : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={type === opt.type ? { boxShadow: '2px 2px 4px rgba(242,87,87,0.2)' } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <VolumeX size={14} className="text-[var(--color-text-muted)] shrink-0" />
              <input
                type="range" min={0} max={1} step={0.05}
                value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-1.5 accent-tomato cursor-pointer"
              />
              <Volume2 size={14} className="text-[var(--color-text-muted)] shrink-0" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
