import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BlockType } from '@/types/world'

export type AIProvider = 'local' | 'openai' | 'gemini' | 'claude'

export const useSettingsStore = defineStore('settings', () => {
  const apiKey = ref(localStorage.getItem('nw_api_key') ?? '')
  const provider = ref<AIProvider>((localStorage.getItem('nw_provider') as AIProvider) ?? 'local')
  const selectedBlock = ref<BlockType>('stone')
  const worldName = ref(localStorage.getItem('nw_world_name') ?? 'My World')

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

  return { apiKey, provider, selectedBlock, worldName, setApiKey, setProvider, setSelectedBlock, setWorldName }
})
