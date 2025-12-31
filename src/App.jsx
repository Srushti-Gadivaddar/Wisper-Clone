import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { startAudioRecording, stopAudioRecording } from "./utils/audioRecorder";
import { usePushToTalk } from "./hooks/usePushToTalk";
import { MicIcon, StopIcon } from "./components/Icons";
import "./App.css";

function App() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [seconds, setSeconds] = useState(0);

  const transcriptRef = useRef("");
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  const start = async () => {
    await startAudioRecording({
      setRecording,
      mediaRecorderRef,
      socketRef,
      timerRef,
      setSeconds,
      onTranscript: (text) => {
        transcriptRef.current += " " + text;
        setTranscript(transcriptRef.current);
      },
    });
  };

  const stop = async () => {
    await stopAudioRecording({
      recording,
      setRecording,
      mediaRecorderRef,
      socketRef,
      timerRef,
    });

    if (!transcriptRef.current.trim()) return;

    await invoke("insert_text_system", {
      text: transcriptRef.current,
    });

    transcriptRef.current = "";
    setTranscript("");
  };

  usePushToTalk(recording, start, stop);

  return (
    <div className="recorder-app">
      <div className="transcript-area">
        <p className="transcript-text">
          {transcript || "Listening… Start speaking"}
        </p>
      </div>

      <div className="timer">
        {recording ? `${seconds}s` : "00:00"}
      </div>

      <div className={`waveform ${recording ? "active" : ""}`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="controls">
        <button
          className={`record-btn ${recording ? "recording" : ""}`}
          onClick={recording ? stop : start}
        >
          {recording ? <StopIcon /> : <MicIcon />}
        </button>
      </div>
    </div>
  );
}

export default App;
