// usePaymentSocket.js
import { useEffect, useRef } from "react";

const usePaymentSocket = (onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return socketRef;
};

export default usePaymentSocket;
