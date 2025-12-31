# 🎙️ Wispr Clone – Voice Dictation Desktop App

A desktop voice dictation application built using **Tauri + React** that converts speech into text in real time using the **Deepgram Streaming API**.  
The app focuses on clean UI, push-to-talk interaction, and practical desktop integration.

---

## 🚀 Features
- 🎙 Push-to-Talk recording
- ⌨ Global keyboard shortcut
- 🌐 Live transcription via WebSocket
- 📋 Auto-paste text into active application
- 🧠 Modular React architecture
- ⚡ Lightweight Tauri desktop app

---

## 🧠 Project Objective

The goal of this project is to build a **real-world desktop voice dictation app** while learning:

- Desktop app development using Tauri
- Real-time audio streaming via WebSockets
- Speech-to-text integration using an external API
- Frontend and backend communication in a desktop environment

---

## 🧱 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Tauri (Rust)
- **Audio**: MediaRecorder API
- **Transcription**: WebSocket (Deepgram compatible)
- **System Control**: Enigo + Clipboard

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install

2. Configure environment variables
Create a .env file in the project root:
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here

3. Run the application (development mode)
npm run tauri dev
````

##📚 Learnings

- Real-time audio capture and streaming
- WebSocket-based speech recognition
- Desktop-specific features using Tauri commands
- UI/UX design for recorder-style applications
- Cross-platform build and packaging

##🔮 Future Enhancements

 - 🌍 Multi-language transcription
 - 💾 Saves transcript to a local text file
 - 🧑‍🤝‍🧑 Speaker identification
 - ☁️ Cloud-based transcript storage
 - 🎨 Advanced waveform and UI animations
