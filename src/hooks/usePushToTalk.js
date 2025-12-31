import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

export function usePushToTalk(recording, start, stop) {
  useEffect(() => {
    let unlisten;

    listen("push-to-talk", () => {
      recording ? stop() : start();
    }).then((fn) => (unlisten = fn));

    return () => {
      if (unlisten) unlisten();
    };
  }, [recording]);
}
