import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BlockType } from '@/types/world'

export type AIProvider = 'local' | 'openai' | 'gemini' | 'claude'

export const useSettingsStore = defineStore('settings', () => {
  const apiKey = ref(localStorage.getItem('nw_api_key') ?? '')
  const provider = ref<AIProvider>((localStorage.getItem('nw_provider') as AIProvider) ?? 'local')
  const selectedBlock = ref<BlockType>('stone')
  const worldName = ref(localStorage.getItem('nw_world_name') ?? 'My World')
  const creatorId = ref(localStorage.getItem('nw_creator_id') ?? 'anonymous_' + Math.random().toString(36).substring(2, 6))

  function setApiKey(key: string): void {
    apiKey.value = key
    localStorage.setItem('nw_api_key', key)
  }

  function setProvider(p: AIProvider): void {
    provider.value = p
    localStorage.setItem('nw_provider', p)
  }

  function setSelectedBlock(b: BlockType): void {
    selectedBlock.value = b
  }

  function setWorldName(name: string): void {
    worldName.value = name
    localStorage.setItem('nw_world_name', name)
  }

  function setCreatorId(id: string): void {
    creatorId.value = id
    localStorage.setItem('nw_creator_id', id)
  }

  const ttsEnabled = ref(localStorage.getItem('nw_tts_enabled') !== 'false')
  const ttsVolume = ref(Number(localStorage.getItem('nw_tts_volume') ?? '100'))
  const ttsRate = ref(Number(localStorage.getItem('nw_tts_rate') ?? '1.0'))
  const ttsPitch = ref(Number(localStorage.getItem('nw_tts_pitch') ?? '1.0'))
  const ttsProvider = ref<'browser' | 'openai'>((localStorage.getItem('nw_tts_provider') as any) ?? 'browser')

  function setTtsEnabled(enabled: boolean): void {
    ttsEnabled.value = enabled
    localStorage.setItem('nw_tts_enabled', String(enabled))
  }

  function setTtsVolume(vol: number): void {
    ttsVolume.value = vol
    localStorage.setItem('nw_tts_volume', String(vol))
  }

  function setTtsRate(rate: number): void {
    ttsRate.value = rate
    localStorage.setItem('nw_tts_rate', String(rate))
  }

  function setTtsPitch(pitch: number): void {
    ttsPitch.value = pitch
    localStorage.setItem('nw_tts_pitch', String(pitch))
  }

  function setTtsProvider(p: 'browser' | 'openai'): void {
    ttsProvider.value = p
    localStorage.setItem('nw_tts_provider', p)
  }

  return {
    apiKey,
    provider,
    selectedBlock,
    worldName,
    creatorId,
    ttsEnabled,
    ttsVolume,
    ttsRate,
    ttsPitch,
    ttsProvider,
    setApiKey,
    setProvider,
    setSelectedBlock,
    setWorldName,
    setCreatorId,
    setTtsEnabled,
    setTtsVolume,
    setTtsRate,
    setTtsPitch,
    setTtsProvider,
  }
})
