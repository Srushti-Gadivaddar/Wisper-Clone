export function handleMicError(err) {
  alert("Microphone access denied or unavailable.");
  console.error(err);
}

export function handleSocketError(err) {
  console.error("Deepgram socket error:", err);
}
