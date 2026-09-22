import { describe, it, expect } from 'vitest'
import { BLOCK_REGISTRY, BLOCK_SIZE } from '../blocks'

describe('Block Registry Engine Test', () => {
  it('should have standard block size of 1', () => {
    expect(BLOCK_SIZE).toBe(1)
  })

  it('should properly register essential nature blocks', () => {
    expect(BLOCK_REGISTRY.air).toBeDefined()
    expect(BLOCK_REGISTRY.air.solid).toBe(false)
    expect(BLOCK_REGISTRY.grass).toBeDefined()
    expect(BLOCK_REGISTRY.grass.solid).toBe(true)
    expect(BLOCK_REGISTRY.water.liquid).toBe(true)
  })

  it('should have category mappings on registered blocks', () => {
    expect(BLOCK_REGISTRY.glass.category).toBe('building')
    expect(BLOCK_REGISTRY.sand.falling).toBe(true)
  })
})
