import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import http from 'http'
import { Server } from 'socket.io'
import crypto from 'crypto'

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const db = new sqlite3.Database('./database.sqlite')

// Robust Typed SQLite Async Wrappers
function run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows as T[])
    })
  })
}

function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row as T | undefined)
    })
  })
}

// Initialize Database Schema
async function initDB() {
  await run(`
    CREATE TABLE IF NOT EXISTS chunks (
      cx INTEGER,
      cz INTEGER,
      blocks TEXT,
      PRIMARY KEY (cx, cz)
    )
  `)
  
  await run(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS plots (
      cx INTEGER,
      cz INTEGER,
      owner_id TEXT,
      plot_name TEXT,
      claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (cx, cz)
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS world_chain (
      block_index INTEGER PRIMARY KEY AUTOINCREMENT,
      previous_hash TEXT,
      hash TEXT,
      creator_id TEXT,
      payload TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const countRow = await get<{ count: number }>('SELECT COUNT(*) as count FROM world_chain')
  if (!countRow || countRow.count === 0) {
    const genesisPayload = JSON.stringify({ message: "Genesis Block of Neon Oasis Voxel Metaverse" })
    const hash = crypto.createHash('sha256').update("0" + "system" + genesisPayload).digest('hex')
    await run('INSERT INTO world_chain (previous_hash, hash, creator_id, payload) VALUES (?, ?, ?, ?)', ['0', hash, 'system', genesisPayload])
  }

  console.log('✅ SQLite Database, Plots & Blockchain Initialized')
}
initDB()

async function appendBlockToChain(creatorId: string, payload: any) {
  const lastBlock = await get<{ hash: string }>('SELECT hash FROM world_chain ORDER BY block_index DESC LIMIT 1')
  const prevHash = lastBlock ? lastBlock.hash : '0'
  const payloadStr = JSON.stringify(payload)
  const timestamp = new Date().toISOString()
  const hash = crypto.createHash('sha256').update(prevHash + creatorId + payloadStr + timestamp).digest('hex')
  await run('INSERT INTO world_chain (previous_hash, hash, creator_id, payload, timestamp) VALUES (?, ?, ?, ?, ?)', [prevHash, hash, creatorId, payloadStr, timestamp])
  console.log(`[Blockchain] Block mined: ${hash.substring(0,8)}... by ${creatorId}`)
}

// ── Socket.IO Multiplayer ──
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)

  socket.on('set-block', async (data: { x: number, y: number, z: number, type: string, creatorId?: string }) => {
    socket.broadcast.emit('set-block', data)

    const creatorId = data.creatorId || 'anonymous'
    await appendBlockToChain(creatorId, { action: 'set-block', ...data })

    const cx = Math.floor(data.x / 16)
    const cz = Math.floor(data.z / 16)
    try {
      const row = await get<{ blocks: string }>('SELECT blocks FROM chunks WHERE cx = ? AND cz = ?', [cx, cz])
      let blocks: any = {}
      if (row && row.blocks) {
        blocks = JSON.parse(row.blocks)
      }
      
      const key = `${data.x},${data.y},${data.z}`
      if (data.type === 'air') {
        delete blocks[key]
      } else {
        blocks[key] = data.type
      }

      await run(
        'INSERT INTO chunks (cx, cz, blocks) VALUES (?, ?, ?) ON CONFLICT(cx, cz) DO UPDATE SET blocks=excluded.blocks',
        [cx, cz, JSON.stringify(blocks)]
      )
    } catch (e) {
      console.error('Error saving block to DB:', e)
    }
  })

  socket.on('player-move', (data: { x: number, y: number, z: number }) => {
    socket.broadcast.emit('player-move', { id: socket.id, ...data })
  })

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id)
    socket.broadcast.emit('player-leave', { id: socket.id })
  })
})

// ── Chunk Endpoints ──

app.get('/api/chunks/:cx/:cz', async (req, res) => {
  const cx = parseInt(req.params.cx)
  const cz = parseInt(req.params.cz)
  
  try {
    const row = await get<{ blocks: string }>('SELECT blocks FROM chunks WHERE cx = ? AND cz = ?', [cx, cz])
    if (row && row.blocks) {
      res.json(JSON.parse(row.blocks))
    } else {
      res.json(null)
    }
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.post('/api/chunks', async (req, res) => {
  const { cx, cz, blocks } = req.body
  try {
    const jsonBlocks = JSON.stringify(blocks)
    await run(
      'INSERT INTO chunks (cx, cz, blocks) VALUES (?, ?, ?) ON CONFLICT(cx, cz) DO UPDATE SET blocks=excluded.blocks',
      [cx, cz, jsonBlocks]
    )
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ── Virtual Real Estate / Plot Endpoints ──

app.get('/api/plots', async (_req, res) => {
  try {
    const plots = await all('SELECT * FROM plots ORDER BY claimed_at DESC')
    res.json(plots)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.get('/api/plots/:cx/:cz', async (req, res) => {
  const cx = parseInt(req.params.cx)
  const cz = parseInt(req.params.cz)
  try {
    const plot = await get('SELECT * FROM plots WHERE cx = ? AND cz = ?', [cx, cz])
    res.json(plot || null)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.post('/api/plots/claim', async (req, res) => {
  const { cx, cz, owner_id, plot_name } = req.body
  if (typeof cx !== 'number' || typeof cz !== 'number' || !owner_id) {
    res.status(400).json({ error: 'Missing plot coordinates or owner id' })
    return
  }

  try {
    const name = plot_name || `Plot (${cx}, ${cz})`
    await run(
      'INSERT INTO plots (cx, cz, owner_id, plot_name) VALUES (?, ?, ?, ?) ON CONFLICT(cx, cz) DO UPDATE SET owner_id=excluded.owner_id, plot_name=excluded.plot_name',
      [cx, cz, owner_id, name]
    )

    await appendBlockToChain(owner_id, {
      action: 'claim-plot',
      cx,
      cz,
      plot_name: name
    })

    const claimEvent = { cx, cz, owner_id, plot_name: name }
    io.emit('plot-claimed', claimEvent)
    io.emit('chat-message', { role: 'ai', content: `🏛️ Plot [${cx}, ${cz}] has been claimed by "${owner_id}" as "${name}"!` })

    res.json({ success: true, plot: claimEvent })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ── Blockchain Ledger Endpoints ──

app.get('/api/chain', async (_req, res) => {
  try {
    const chain = await all('SELECT * FROM world_chain ORDER BY block_index DESC LIMIT 50')
    res.json(chain)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ── Chat Endpoints ──

app.get('/api/chat', async (_req, res) => {
  try {
    const history = await all('SELECT role, content FROM chat_history ORDER BY id ASC')
    res.json(history)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.post('/api/chat', async (req, res) => {
  const { role, content } = req.body
  try {
    await run('INSERT INTO chat_history (role, content) VALUES (?, ?)', [role, content])
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// Clear world (for testing)
app.post('/api/clear', async (_req, res) => {
  try {
    await run('DELETE FROM chunks')
    await run('DELETE FROM chat_history')
    await run('DELETE FROM plots')
    io.emit('clear-world')
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ── Decentralized AI Crowdsourcing (P2P Task Pool) ──
interface Task {
  id: string
  prompt: string
  cx: number
  cz: number
  status: 'pending' | 'processing'
  workerId?: string | undefined
  creatorId: string
}

const taskPool = new Map<string, Task>()

app.post('/api/generate', (req, res) => {
  const { prompt, cx, cz, creatorId } = req.body
  
  const taskId = Math.random().toString(36).substring(2, 9)
  const task: Task = { id: taskId, prompt, cx, cz, creatorId: creatorId || 'anonymous', status: 'pending' }
  taskPool.set(taskId, task)

  res.json({ status: 'queued', message: `Task queued in P2P Compute Pool.` })

  io.emit('chat-message', { role: 'ai', content: `[Architect] Task created by ${task.creatorId}: "${prompt}". Deploying to worker node...` })
  io.emit('build-progress', { status: 'planning', prompt })
  io.emit('new-task', task)
})

io.on('connection', (socket) => {
  // Decentralized Worker task claim & submit
  socket.on('claim-task', (taskId: string, callback: (res: { success: boolean, task?: Task }) => void) => {
    const task = taskPool.get(taskId)
    if (task && task.status === 'pending') {
      task.status = 'processing'
      task.workerId = socket.id
      callback({ success: true, task })
      io.emit('chat-message', { role: 'ai', content: `[Worker ${socket.id.substring(0,4)}] Assigned task: "${task.prompt}". Compiling DSL...` })
    } else {
      callback({ success: false })
    }
  })

  socket.on('task-progress', (data: any) => {
    io.emit('build-progress', data)
  })

  socket.on('submit-task', async (data: { taskId: string, blocks: any[] }) => {
    const { taskId, blocks } = data
    const task = taskPool.get(taskId)
    if (task && task.workerId === socket.id) {
      taskPool.delete(taskId)
      io.emit('chat-message', { role: 'ai', content: `[Worker ${socket.id.substring(0,4)}] Architecture build complete! (${blocks.length} blocks placed)` })
      io.emit('build-progress', { status: 'completed', blocksTotal: blocks.length })
      
      const batchUpdates = new Map<string, any[]>()
      
      blocks.forEach((b: any) => {
        io.emit('set-block', b)
        const chunkKey = `${Math.floor(b.x / 16)},${Math.floor(b.z / 16)}`
        if (!batchUpdates.has(chunkKey)) batchUpdates.set(chunkKey, [])
        batchUpdates.get(chunkKey)!.push(b)
      })

      await appendBlockToChain(task.creatorId, { action: 'ai-build', prompt: task.prompt, blocksCount: blocks.length })

      for (const [chunkKey, chunkBlocks] of batchUpdates.entries()) {
        const [cx, cz] = chunkKey.split(',').map(Number)
        get<{ blocks: string }>('SELECT blocks FROM chunks WHERE cx = ? AND cz = ?', [cx, cz]).then((row) => {
          let dbBlocks = row && row.blocks ? JSON.parse(row.blocks) : {}
          chunkBlocks.forEach((b: any) => {
            dbBlocks[`${b.x},${b.y},${b.z}`] = b.type
          })
          run('INSERT INTO chunks (cx, cz, blocks) VALUES (?, ?, ?) ON CONFLICT(cx, cz) DO UPDATE SET blocks=excluded.blocks', [cx, cz, JSON.stringify(dbBlocks)])
        }).catch(() => {})
      }
    }
  })

  socket.on('disconnect', () => {
    for (const task of taskPool.values()) {
      if (task.workerId === socket.id) {
        task.status = 'pending'
        task.workerId = undefined
        io.emit('chat-message', { role: 'ai', content: `[Server] Worker disconnected. Task re-queued.` })
        io.emit('new-task', task)
      }
    }
  })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`🚀 NewWorld AI Metaverse Backend running on http://localhost:${PORT}`)
})
