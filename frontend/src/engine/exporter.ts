import { BlockType } from '@/types/world'
import { BLOCK_COLORS, isSolid } from './blocks'

export class VoxelModelExporter {
  /**
   * Generates a Wavefront .OBJ string and triggers a browser file download.
   */
  public exportToOBJ(
    blocks: Map<string, { type: BlockType }>,
    filename: string = 'newworld_model.obj'
  ): void {
    let objContent = `# NewWorld AI Sandbox 3D Model Exporter\n# Generated at ${new Date().toISOString()}\n\n`
    let mtlContent = `# NewWorld AI Sandbox Materials\n\n`

    const materialsUsed = new Set<BlockType>()
    let vertexOffset = 1

    for (const [key, { type }] of blocks.entries()) {
      if (type === 'air' || !isSolid(type)) continue
      materialsUsed.add(type)

      const [x, y, z] = key.split(',').map(Number)

      // 8 vertices for the unit cube
      const v = [
        [x, y, z],
        [x + 1, y, z],
        [x + 1, y + 1, z],
        [x, y + 1, z],
        [x, y, z + 1],
        [x + 1, y, z + 1],
        [x + 1, y + 1, z + 1],
        [x, y + 1, z + 1],
      ]

      for (const [vx, vy, vz] of v) {
        objContent += `v ${vx} ${vy} ${vz}\n`
      }

      objContent += `usemtl mat_${type}\n`

      // 6 quad faces (12 triangles)
      const faces = [
        [1, 2, 3, 4], // Front
        [5, 8, 7, 6], // Back
        [1, 5, 6, 2], // Bottom
        [4, 3, 7, 8], // Top
        [1, 4, 8, 5], // Left
        [2, 6, 7, 3], // Right
      ]

      for (const [f1, f2, f3, f4] of faces) {
        const o = vertexOffset
        objContent += `f ${o + f1 - 1} ${o + f2 - 1} ${o + f3 - 1}\n`
        objContent += `f ${o + f1 - 1} ${o + f3 - 1} ${o + f4 - 1}\n`
      }

      vertexOffset += 8
    }

    for (const mat of materialsUsed) {
      const hex = BLOCK_COLORS[mat] || 0xcccccc
      const r = ((hex >> 16) & 255) / 255
      const g = ((hex >> 8) & 255) / 255
      const b = (hex & 255) / 255

      mtlContent += `newmtl mat_${mat}\n`
      mtlContent += `Kd ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}\n`
      mtlContent += `Ka 0.1 0.1 0.1\n`
      mtlContent += `d 1.0\n\n`
    }

    this.downloadFile(filename, objContent, 'text/plain')
    this.downloadFile(filename.replace('.obj', '.mtl'), mtlContent, 'text/plain')
  }

  /**
   * Exports world blocks as a lightweight schematic JSON.
   */
  public exportToJSON(
    blocks: Map<string, { type: BlockType }>,
    filename: string = 'newworld_schematic.json'
  ): void {
    const data: Record<string, BlockType> = {}
    for (const [k, v] of blocks.entries()) {
      if (v.type !== 'air') {
        data[k] = v.type
      }
    }
    const jsonStr = JSON.stringify(data, null, 2)
    this.downloadFile(filename, jsonStr, 'application/json')
  }

  private downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export const exporter = new VoxelModelExporter()
