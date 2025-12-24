import { useRef, useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function App() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [pttActive, setPttActive] = useState(false);

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  //START
  const startRecording = async () => {
    if (recording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;

    const socket = new WebSocket(
      "wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true",
      ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

      mediaRecorder.start(250);
      setRecording(true);
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const alt = data.channel?.alternatives?.[0];
      if (alt?.transcript && data.is_final) {
        setTranscript((t) => t + " " + alt.transcript);
      }
    };

    mediaRecorder.ondataavailable = (e) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(e.data);
      }
    };
  };
  
  // STOP
  const stopRecording = async () => {
    if (!recording) return;

    clearInterval(timerRef.current);
    timerRef.current = null;

    mediaRecorderRef.current?.stop();
    socketRef.current?.close();

    setRecording(false);

    await invoke("save_to_file", {
      filename: "transcript.txt",
      content: transcript,
    });
  };

  useEffect(() => {
    const unlistenPromise = listen("push-to-talk", () => {
      setPttActive(true);
      recording ? stopRecording() : startRecording();
      setTimeout(() => setPttActive(false), 300);
    });

    return () => {
      unlistenPromise.then((u) => u());
    };
  }, [recording]);

  return (
    <div className="recorder-app">
      <div className="transcript-area">
        <p className="transcript-text">
          {transcript || "Listening… Start speaking"}
        </p>
      </div>

      <div className="timer">
        {recording ? formatTime(seconds) : "00:00"}
      </div>

      <div className={`waveform ${recording ? "active" : ""}`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>

      {pttActive && <div className="ptt-indicator">⌨ Push-to-Talk</div>}

      <div className="controls">
        <button
          className={`record-btn ${recording ? "recording" : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? (
            <svg viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
