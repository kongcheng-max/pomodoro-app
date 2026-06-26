import type { NoiseType } from '../types'

let audioCtx: AudioContext | null = null
let sourceNode: AudioBufferSourceNode | null = null
let gainNode: GainNode | null = null
let currentVolume = 0.3
let playing = false

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Generate white noise samples (uniform distribution)
 */
function generateWhiteNoise(length: number): Float32Array {
  const buffer = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    buffer[i] = Math.random() * 2 - 1
  }
  return buffer
}

/**
 * Generate pink noise using the Paul Kellet refined algorithm.
 * Uses 7 filter stages to achieve approximately -3dB/octave rolloff.
 */
function generatePinkNoise(length: number): Float32Array {
  const buffer = new Float32Array(length)
  // Paul Kellet (refined) — 7 state variables
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980
    buffer[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
    buffer[i] *= 0.11 // Normalize output level
    b6 = white * 0.115926
  }
  return buffer
}

/**
 * Generate brown noise (red noise) using a leaky integrator.
 * Produces approximately -6dB/octave rolloff — deeper, warmer sound.
 */
function generateBrownNoise(length: number): Float32Array {
  const buffer = new Float32Array(length)
  let lastOut = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    buffer[i] = (lastOut + 0.02 * white) / 1.02
    lastOut = buffer[i]
    buffer[i] *= 3.5 // Normalize output level
  }
  return buffer
}

/**
 * Create an AudioBuffer filled with the requested noise type.
 * Buffer length is 2 seconds to allow seamless looping.
 */
function createNoiseBuffer(ctx: AudioContext, type: NoiseType): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * 2 // 2 seconds
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  let noise: Float32Array
  switch (type) {
    case 'white':
      noise = generateWhiteNoise(length)
      break
    case 'pink':
      noise = generatePinkNoise(length)
      break
    case 'brown':
      noise = generateBrownNoise(length)
      break
  }

  data.set(noise)
  return buffer
}

/**
 * Start playing white noise of the given type at the given volume.
 * Stops any currently playing noise first.
 */
export function startNoise(type: NoiseType, volume: number): void {
  stopNoise()
  try {
    const ctx = getAudioContext()
    const buffer = createNoiseBuffer(ctx, type)

    sourceNode = ctx.createBufferSource()
    sourceNode.buffer = buffer
    sourceNode.loop = true

    gainNode = ctx.createGain()
    gainNode.gain.value = volume

    sourceNode.connect(gainNode)
    gainNode.connect(ctx.destination)

    sourceNode.start()

    currentVolume = volume
    playing = true
  } catch {
    // Silently fail — AudioContext may be blocked by browser autoplay policy
    playing = false
  }
}

/**
 * Stop any currently playing white noise.
 */
export function stopNoise(): void {
  try {
    if (sourceNode) {
      sourceNode.stop()
      sourceNode.disconnect()
      sourceNode = null
    }
    if (gainNode) {
      gainNode.disconnect()
      gainNode = null
    }
  } catch {
    // Node may already be stopped
  }
  playing = false
}

/**
 * Adjust volume without restarting playback.
 */
export function setNoiseVolume(volume: number): void {
  currentVolume = volume
  if (gainNode) {
    gainNode.gain.value = volume
  }
}

/**
 * Change noise type. Restarts playback with the new type.
 */
export function setNoiseType(type: NoiseType): void {
  if (playing) {
    startNoise(type, currentVolume)
  }
}

/**
 * Returns whether noise is currently playing.
 */
export function isNoisePlaying(): boolean {
  return playing
}
