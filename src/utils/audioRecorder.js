import { createDeepgramSocket } from "./deepgramSocket";
import { handleMicError } from "./errorHandlers";

export async function startAudioRecording({
  setRecording,
  mediaRecorderRef,
  socketRef,
  timerRef,
  setSeconds,
  onTranscript,
}) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    const socket = createDeepgramSocket(onTranscript);

    socket.onopen = () => {
      mediaRecorder.start(250);
      setRecording(true);

      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    };

    mediaRecorder.ondataavailable = (e) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(e.data);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    socketRef.current = socket;
  } catch (err) {
    handleMicError(err);
  }
}

export async function stopAudioRecording({
  recording,
  setRecording,
  mediaRecorderRef,
  socketRef,
  timerRef,
}) {
  if (!recording) return;

  clearInterval(timerRef.current);
  timerRef.current = null;

  mediaRecorderRef.current?.stop();
  socketRef.current?.close();

  setRecording(false);
}
