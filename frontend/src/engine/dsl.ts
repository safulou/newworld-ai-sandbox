import { DSLCommand, BuildAction, BlockType } from '@/types/world'

/**
 * Compiles high-level procedural DSL commands into discrete block placement actions.
 * Supports boxes, cylinders, pyramids, spheres, staircases, and template scatter.
 */
export function compileDSL(
  commands: DSLCommand[],
  origin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
): BuildAction[] {
  const blockMap = new Map<string, { pos: [number, number, number]; material: BlockType }>()

  function set(x: number, y: number, z: number, mat: BlockType) {
    const rx = Math.round(origin.x + x)
    const ry = Math.round(origin.y + y)
    const rz = Math.round(origin.z + z)
    blockMap.set(`${rx},${ry},${rz}`, { pos: [rx, ry, rz], material: mat })
  }

  for (const cmd of commands) {
    if (!cmd || typeof cmd !== 'object') continue

    switch (cmd.type) {
      case 'place_block': {
        const [x, y, z] = cmd.position
        set(x, y, z, cmd.material)
        break
      }

      case 'box': {
        const [x1, y1, z1] = cmd.from
        const [x2, y2, z2] = cmd.to
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)
        const minZ = Math.min(z1, z2)
        const maxZ = Math.max(z1, z2)

        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
              if (cmd.hollow) {
                const isBorder =
                  x === minX || x === maxX ||
                  y === minY || y === maxY ||
                  z === minZ || z === maxZ
                if (!isBorder) continue
              }
              set(x, y, z, cmd.material)
            }
          }
        }
        break
      }

      case 'cylinder': {
        const [cx, cy, cz] = cmd.center
        const r = Math.max(1, Math.round(cmd.radius))
        const h = Math.max(1, Math.round(cmd.height))
        const rSq = r * r
        const innerSq = (r - 1) * (r - 1)

        for (let y = 0; y < h; y++) {
          for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
              const dSq = dx * dx + dz * dz
              if (dSq <= rSq) {
                if (cmd.hollow && y > 0 && y < h - 1 && dSq < innerSq) {
                  continue
                }
                set(cx + dx, cy + y, cz + dz, cmd.material)
              }
            }
          }
        }
        break
      }

      case 'pyramid': {
        const [bx, by, bz] = cmd.base
        const s = Math.max(1, Math.round(cmd.size))
        const h = Math.min(s, Math.max(1, Math.round(cmd.height)))

        for (let dy = 0; dy < h; dy++) {
          const currentRadius = s - dy
          for (let dx = -currentRadius; dx <= currentRadius; dx++) {
            for (let dz = -currentRadius; dz <= currentRadius; dz++) {
              if (cmd.hollow && dy < h - 1) {
                const isEdge =
                  Math.abs(dx) === currentRadius || Math.abs(dz) === currentRadius
                if (!isEdge) continue
              }
              set(bx + dx, by + dy, bz + dz, cmd.material)
            }
          }
        }
        break
      }

      case 'sphere': {
        const [cx, cy, cz] = cmd.center
        const r = Math.max(1, Math.round(cmd.radius))
        const rSq = r * r
        const innerSq = (r - 1) * (r - 1)

        for (let dx = -r; dx <= r; dx++) {
          for (let dy = -r; dy <= r; dy++) {
            for (let dz = -r; dz <= r; dz++) {
              const dSq = dx * dx + dy * dy + dz * dz
              if (dSq <= rSq) {
                if (cmd.hollow && dSq < innerSq) continue
                set(cx + dx, cy + dy, cz + dz, cmd.material)
              }
            }
          }
        }
        break
      }

      case 'stairs': {
        const [sx, sy, sz] = cmd.from
        const steps = Math.max(1, Math.round(cmd.steps))
        for (let i = 0; i < steps; i++) {
          let stepX = sx
          let stepZ = sz
          if (cmd.direction === '+x') stepX += i
          else if (cmd.direction === '-x') stepX -= i
          else if (cmd.direction === '+z') stepZ += i
          else if (cmd.direction === '-z') stepZ -= i

          // Step base and vertical riser
          for (let y = 0; y <= sy + i; y++) {
            set(stepX, y, stepZ, cmd.material)
            // 2-wide stair
            if (cmd.direction === '+x' || cmd.direction === '-x') {
              set(stepX, y, stepZ + 1, cmd.material)
            } else {
              set(stepX + 1, y, stepZ, cmd.material)
            }
          }
        }
        break
      }

      case 'scatter': {
        const [cx, cy, cz] = cmd.center
        const r = Math.max(2, cmd.radius)
        const count = Math.min(20, Math.max(1, cmd.count))

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5)
          const dist = Math.random() * r
          const tx = Math.round(cx + Math.cos(angle) * dist)
          const tz = Math.round(cz + Math.sin(angle) * dist)

          if (cmd.template === 'tree') {
            // Trunk
            for (let y = 0; y < 4; y++) set(tx, cy + y, tz, 'wood')
            // Leaves crown
            for (let lx = -2; lx <= 2; lx++) {
              for (let lz = -2; lz <= 2; lz++) {
                for (let ly = 3; ly <= 5; ly++) {
                  if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && ly === 5) continue
                  set(tx + lx, cy + ly, tz + lz, 'leaves')
                }
              }
            }
          } else if (cmd.template === 'rock') {
            set(tx, cy, tz, 'stone')
            set(tx + 1, cy, tz, 'stone')
            set(tx, cy + 1, tz, 'stone')
          } else if (cmd.template === 'column') {
            for (let y = 0; y < 5; y++) set(tx, cy + y, tz, 'brick')
            set(tx, cy + 5, tz, 'glass')
          } else if (cmd.template === 'lamp') {
            for (let y = 0; y < 3; y++) set(tx, cy + y, tz, 'stone')
            set(tx, cy + 3, tz, 'glass')
          }
        }
        break
      }
    }
  }

  return Array.from(blockMap.values()).map(b => ({
    type: 'place_block',
    position: b.pos,
    material: b.material,
  }))
}
