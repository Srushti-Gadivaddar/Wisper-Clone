import { handleSocketError } from "./errorHandlers";

export function createDeepgramSocket(onTranscript) {
  const socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true",
    ["token", import.meta.env.VITE_DEEPGRAM_API_KEY]
  );

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    const alt = data.channel?.alternatives?.[0];
    if (alt?.transcript && data.is_final) {
      onTranscript(alt.transcript);
    }
  };

  socket.onerror = handleSocketError;

  return socket;
}
