import { AIBuildResponse, BuildAction, DSLCommand } from '@/types/world'
import { compileDSL } from './dsl'

export const SYSTEM_PROMPT = `You are a high-performance 3D Voxel World Architect.
Given a user prompt, output ONLY valid JSON describing the 3D structure using procedural DSL commands:

JSON SCHEMA:
{
  "description": "brief 1-sentence architectural summary",
  "commands": [
    // Available DSL commands:
    // 1. Box (walls, rooms, foundations, roofs)
    { "type": "box", "from": [x1, y1, z1], "to": [x2, y2, z2], "material": "materialType", "hollow": false },

    // 2. Cylinder (towers, pillars, wells, circular arenas)
    { "type": "cylinder", "center": [x, y, z], "radius": 4, "height": 8, "material": "materialType", "hollow": true },

    // 3. Pyramid (roofs, monuments, Egyptian temples)
    { "type": "pyramid", "base": [x, y, z], "size": 6, "height": 6, "material": "materialType", "hollow": false },

    // 4. Sphere (domes, planets, energy cores)
    { "type": "sphere", "center": [x, y, z], "radius": 4, "material": "materialType", "hollow": false },

    // 5. Stairs (steps, bridges, ramps)
    { "type": "stairs", "from": [x, y, z], "steps": 6, "direction": "+z", "material": "materialType" },

    // 6. Scatter (surrounding nature, biomes, foliage)
    { "type": "scatter", "center": [x, y, z], "radius": 12, "count": 6, "template": "tree" },

    // 7. Single block (precise details, windows, doors, accents)
    { "type": "place_block", "position": [x, y, z], "material": "materialType" }
  ]
}

Available materials: grass, dirt, stone, wood, leaves, sand, water, brick, glass, plank, snow
Coordinate System:
- Origin [0, 0, 0] is the build center anchor.
- y=0 is ground level (build upwards with y >= 0).
- x is East(+)/West(-), z is South(+)/North(-).
- Keep coordinates within range [-20, 20] for x/z and [0, 30] for y.

IMPORTANT: Output ONLY pure JSON. No markdown backticks, no explanations.`

export function localFallback(
  prompt: string,
  buildOrigin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
): AIBuildResponse {
  const lower = prompt.toLowerCase()
  const commands: DSLCommand[] = []
  let desc = 'A custom procedural structure'

  if (lower.includes('castle') || lower.includes('fort') || lower.includes('城堡')) {
    desc = 'A medieval stone fortress with four corner watchtowers, crenellations, and central courtyard'
    // Main base walls (hollow)
    commands.push({ type: 'box', from: [-7, 0, -7], to: [7, 5, 7], material: 'stone', hollow: true })
    // Courtyard floor
    commands.push({ type: 'box', from: [-6, 0, -6], to: [6, 0, 6], material: 'plank' })
    // 4 Corner Towers
    commands.push({ type: 'cylinder', center: [-7, 0, -7], radius: 2, height: 9, material: 'stone', hollow: false })
    commands.push({ type: 'cylinder', center: [7, 0, -7], radius: 2, height: 9, material: 'stone', hollow: false })
    commands.push({ type: 'cylinder', center: [-7, 0, 7], radius: 2, height: 9, material: 'stone', hollow: false })
    commands.push({ type: 'cylinder', center: [7, 0, 7], radius: 2, height: 9, material: 'stone', hollow: false })
    // Tower Roofs
    commands.push({ type: 'pyramid', base: [-7, 9, -7], size: 2, height: 3, material: 'brick' })
    commands.push({ type: 'pyramid', base: [7, 9, -7], size: 2, height: 3, material: 'brick' })
    commands.push({ type: 'pyramid', base: [-7, 9, 7], size: 2, height: 3, material: 'brick' })
    commands.push({ type: 'pyramid', base: [7, 9, 7], size: 2, height: 3, material: 'brick' })
    // Gate archway
    commands.push({ type: 'box', from: [-1, 1, 7], to: [1, 3, 7], material: 'air' })
  } else if (lower.includes('tower') || lower.includes('cyber') || lower.includes('塔') || lower.includes('neon')) {
    desc = 'A glowing cyberpunk skyscraper with glass observation decks and neon foliage'
    // Foundation
    commands.push({ type: 'cylinder', center: [0, 0, 0], radius: 4, height: 16, material: 'stone', hollow: true })
    // Glass mid-deck
    commands.push({ type: 'cylinder', center: [0, 8, 0], radius: 5, height: 3, material: 'glass', hollow: true })
    // Upper spire
    commands.push({ type: 'cylinder', center: [0, 16, 0], radius: 2, height: 8, material: 'brick', hollow: false })
    // Energy core top
    commands.push({ type: 'sphere', center: [0, 25, 0], radius: 3, material: 'leaves' })
    // Surrounding cyber lamps
    commands.push({ type: 'scatter', center: [0, 0, 0], radius: 10, count: 6, template: 'lamp' })
  } else if (lower.includes('tree') || lower.includes('forest') || lower.includes('森') || lower.includes('樹')) {
    desc = 'A bioluminescent enchanted forest with ancient trees and rocky paths'
    // Ground moss
    commands.push({ type: 'box', from: [-10, 0, -10], to: [10, 0, 10], material: 'grass' })
    commands.push({ type: 'scatter', center: [0, 0, 0], radius: 9, count: 8, template: 'tree' })
    commands.push({ type: 'scatter', center: [0, 0, 0], radius: 7, count: 5, template: 'rock' })
  } else if (lower.includes('pyramid') || lower.includes('desert') || lower.includes('金字塔')) {
    desc = 'A grand desert pyramid with an oasis pond and palm groves'
    commands.push({ type: 'pyramid', base: [0, 0, 0], size: 9, height: 9, material: 'sand', hollow: false })
    // Oasis pond
    commands.push({ type: 'box', from: [8, 0, -4], to: [12, 0, 4], material: 'water' })
    commands.push({ type: 'scatter', center: [10, 0, 0], radius: 4, count: 3, template: 'tree' })
  } else if (lower.includes('house') || lower.includes('home') || lower.includes('cottage') || lower.includes('屋') || lower.includes('房')) {
    desc = 'A cozy country cottage with plank porch, glass windows, and brick chimney'
    // House walls
    commands.push({ type: 'box', from: [-4, 0, -3], to: [4, 4, 3], material: 'plank', hollow: true })
    // Floor
    commands.push({ type: 'box', from: [-4, 0, -3], to: [4, 0, 3], material: 'wood' })
    // Roof
    commands.push({ type: 'pyramid', base: [0, 4, 0], size: 5, height: 3, material: 'brick' })
    // Windows
    commands.push({ type: 'place_block', position: [-2, 2, 3], material: 'glass' })
    commands.push({ type: 'place_block', position: [2, 2, 3], material: 'glass' })
    // Door
    commands.push({ type: 'place_block', position: [0, 1, 3], material: 'air' })
    commands.push({ type: 'place_block', position: [0, 2, 3], material: 'air' })
    // Chimney
    commands.push({ type: 'box', from: [3, 4, -2], to: [4, 8, -1], material: 'brick' })
    // Porch stairs
    commands.push({ type: 'stairs', from: [0, 0, 4], steps: 2, direction: '+z', material: 'wood' })
    // Garden trees
    commands.push({ type: 'scatter', center: [0, 0, 0], radius: 8, count: 3, template: 'tree' })
  } else {
    desc = `A modern architectural plaza inspired by "${prompt}"`
    commands.push({ type: 'box', from: [-5, 0, -5], to: [5, 0, 5], material: 'stone' })
    commands.push({ type: 'cylinder', center: [0, 1, 0], radius: 3, height: 4, material: 'glass', hollow: true })
    commands.push({ type: 'sphere', center: [0, 6, 0], radius: 2, material: 'snow' })
    commands.push({ type: 'scatter', center: [0, 0, 0], radius: 7, count: 4, template: 'lamp' })
  }

  const actions = compileDSL(commands, buildOrigin)
  return { description: desc, commands, actions }
}

export async function generateBuild(
  prompt: string,
  apiKey: string,
  provider: 'openai' | 'gemini' | 'claude' | 'local',
  buildOrigin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
): Promise<AIBuildResponse> {
  if (provider === 'local' || !apiKey) {
    return localFallback(prompt, buildOrigin)
  }

  try {
    let rawJson = ''

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })
      const data = await res.json()
      rawJson = data.choices?.[0]?.message?.content ?? ''
    } else if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.7 }
          }),
        }
      )
      const data = await res.json()
      rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    } else if (provider === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      rawJson = data.content?.[0]?.text ?? ''
    }

    rawJson = rawJson.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(rawJson)

    let actions: BuildAction[] = []
    if (parsed.commands && Array.isArray(parsed.commands)) {
      actions = compileDSL(parsed.commands, buildOrigin)
    } else if (parsed.actions && Array.isArray(parsed.actions)) {
      actions = parsed.actions.map((a: any) => ({
        ...a,
        position: [
          a.position[0] + buildOrigin.x,
          a.position[1] + buildOrigin.y,
          a.position[2] + buildOrigin.z,
        ],
      }))
    }

    return {
      description: parsed.description || 'AI Generated Voxel Structure',
      commands: parsed.commands,
      actions,
    }
  } catch (err) {
    console.warn('AI call failed, falling back to procedural generator:', err)
    return localFallback(prompt, buildOrigin)
  }
}

export async function chatWithNPC(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string,
  apiKey: string,
  provider: 'openai' | 'gemini' | 'claude' | 'local'
): Promise<string> {
  if (provider === 'local' || !apiKey) {
    const greetings = [
      "Welcome to NewWorld! Feel free to explore and build anything you imagine.",
      "The voxel matrix is thriving today. Need help finding a plot of land?",
      "I see the skyline growing taller every day. Ask me anything about this world!",
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          temperature: 0.8,
          max_tokens: 512,
        }),
      })
      const data = await res.json()
      return data.choices?.[0]?.message?.content ?? '...'
    } else if (provider === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 512,
          system: systemPrompt,
          messages,
        }),
      })
      const data = await res.json()
      return data.content?.[0]?.text ?? '...'
    } else if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          }),
        }
      )
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '...'
    }
    return 'Hello, traveler!'
  } catch {
    return 'Hello, traveler!'
  }
}
