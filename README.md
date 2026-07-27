# NewWorld AI Sandbox 🌍

**An open-source, browser-based voxel sandbox where prompts become playable worlds.**

> Type a sentence. Walk into your world.

![NewWorld AI Sandbox](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Built with Three.js](https://img.shields.io/badge/built%20with-Three.js-black)

---

## What is this?

NewWorld AI Sandbox is a browser-based 3D voxel world you can build with natural language. Describe what you want — a castle, a forest, a harbor town — and AI generates it as walkable 3D space. No coding required. Bring your own API key (BYOK) or use the built-in local generator without any key at all.

Think: **AI-native Minecraft in the browser.**

## Features (v0.1)

| Feature | Status |
|---|---|
| Browser 3D voxel world | ✅ |
| WASD movement + mouse look | ✅ |
| Block place & break | ✅ |
| AI build from text prompt | ✅ |
| Local AI (no key needed) | ✅ |
| OpenAI / Gemini / Claude BYOK | ✅ |
| AI NPC conversation | ✅ |
| World save / load (localStorage) | ✅ |
| World JSON export / import | ✅ |
| Block palette (10 types) | ✅ |

## Quick Start

### Option 1 — Run locally (recommended)

**Requirements:** Node.js 18+

```bash
git clone https://github.com/safulou/newworld-ai-sandbox.git
cd newworld-ai-sandbox/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Option 2 — GitHub Pages (coming soon)

A live demo will be deployed at `https://safulou.github.io/newworld-ai-sandbox/`

## Controls

| Key | Action |
|---|---|
| `Click` | Lock cursor / Break block |
| `Right Click` | Place block |
| `WASD` | Move |
| `Space` | Jump |
| `T` | Open AI builder |
| `E` | Talk to nearby NPC |
| `F1` | Settings (API key, world name) |
| `F2` | Save world |
| `ESC` | Unlock cursor |

## AI Providers

Press **F1** to open Settings and choose your AI provider:

| Provider | Model | Notes |
|---|---|---|
| **Local** | Built-in rules | No API key, works offline |
| **OpenAI** | gpt-4o-mini | Fast and affordable |
| **Google Gemini** | gemini-1.5-flash | Free tier available |
| **Anthropic Claude** | claude-haiku-4-5 | Fast and precise |

> **Privacy:** API keys are stored only in your browser's localStorage. All AI calls go directly from your browser to the AI provider — no data passes through any intermediate server.

## Project Structure

```
newworld-ai-sandbox/
├── frontend/
│   ├── src/
│   │   ├── engine/        # Three.js scene, world, player, raycast, AI
│   │   ├── components/    # Vue components (GameCanvas, HUD, panels)
│   │   ├── stores/        # Pinia state (settings, ui)
│   │   └── types/         # TypeScript types
│   ├── index.html
│   └── vite.config.ts
├── LICENSE
└── README.md
```

## Roadmap

- [ ] GitHub Pages auto-deploy (GitHub Actions)
- [ ] More block types and textures
- [ ] Multiple world templates (harbor, forest, desert)
- [ ] NPC with custom knowledge base (RAG)
- [ ] World sharing via URL
- [ ] Mobile touch controls
- [ ] Multi-player (WebSocket)

## Contributing

PRs are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

## License

MIT © [Arsen](https://github.com/safulou)
