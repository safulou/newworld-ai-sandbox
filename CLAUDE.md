# CLAUDE.md — NewWorld AI Sandbox

> Session start:
> 「讀 CLAUDE.md 和 logs/devlog-YYYY-MM-DD.md（最新日誌），告訴我專案現況與 P0 任務。」

## Project Overview

`newworld-ai-sandbox` 是一個基於瀏覽器的 3D 體素 AI 沙盒元宇宙（Prompt-to-World）。
核心架構與功能包含：

- **3D 體素引擎**：Three.js 渲染、60+ 材質方塊、程序化多生物群系、光影與後製著色器（Bloom / CRT / 色差）。
- **AI 雙引擎生成**：支援 Local 本地規則與 OpenAI / Gemini / Claude BYOK 自然語言即時創造。
- **AI NPC 伴侶與多代理社會**：5 位具備獨立性格的 NPC、Web Speech / Spatial TTS 語音發音、Multi-Agent 自主交談、好感度圖譜與自主工單施工。
- **賽博邏輯與物理系統**：BFS 量子邏輯導線、細胞自動機流體（水與熔岩凝結黑曜石）、TNT 爆破碎片物理、浮力游泳。
- **四大旗艦玩法**：賽博合成器音符方塊（25 半音階）、AI 全息藍圖投影、野生機械獸與寵物馴養、生存冒險與地下城 Boss 戰。
- **多人協同與語音**：Socket.IO 方塊持久化即時同步、3D 遠端 Avatar 平滑插值、WebRTC 3D 空間語音。

## Development Rules

- **語言規範**：面相對話、開發日誌、文件與 Commit 訊息預設使用繁體中文（Traditional Chinese）。
- **純代碼 Web Audio 零版權依賴**：音效、環境音、合成器音頻一律採用 Web Audio API 純代碼振盪器/噪聲合成，不引入外部未授權音效檔。
- **隱私第一 (BYOK)**：使用者的 API Key 僅儲存於本地瀏覽器 localStorage，不得傳輸至任何未授權第三方後端。
- **品質驗證標準**：修改代碼後必須通過完整前端驗證：
  ```bash
  cd frontend
  npm test -- --run
  npm run build
  ```
  確保 100% 測試通過與 0 Error / 0 Warning。

## Common Commands

```bash
# 前端開發啟動 (Port: 3000 或 5173)
cd frontend && npm run dev

# 後端開發啟動 (Port: 4000)
cd backend && npm run dev

# 前端單元測試
cd frontend && npm test -- --run

# 前端生產打包驗證 (型別檢查 + Vite Build)
cd frontend && npm run build
```

## Session End Flow

收尾流程：

1. 執行 `git status` 與 `git diff --stat`。
2. 更新當日 `logs/devlog-YYYY-MM-DD.md` 與 `工作日誌.md`（採用標準七區塊格式）。
3. 貼出日誌區塊等待使用者確認。
4. 使用者確認後執行：程式碼 commit → devlog commit → `git push origin main`。
5. 產出 Google 工作日誌填寫摘要供使用者複製。
