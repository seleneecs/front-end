import { useEffect } from "react";

const usePaymentSocket = (checkoutRequestID, onMessage) => {
  useEffect(() => {
    if (!checkoutRequestID) return;

    const wsUrl = import.meta.env.VITE_WS_URL; 
    if (!wsUrl) {
      console.error("WebSocket URL is not defined in environment variables");
      return;
    }

    // Append the checkoutRequestID as a query param or path if needed:
    // e.g., `${wsUrl}?checkoutRequestID=${checkoutRequestID}`
    // or `${wsUrl}/${checkoutRequestID}`
    // depending on your backend design

    const fullUrl = `${wsUrl}?checkoutRequestID=${checkoutRequestID}`;

    const socket = new WebSocket(fullUrl);

    socket.onopen = () => {
      console.log("WebSocket connected", fullUrl);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed: code=${event.code} reason=${event.reason}`);
    };

    return () => {
      socket.close();
      console.log("WebSocket closed on cleanup");
    };
  }, [checkoutRequestID, onMessage]);
};

export default usePaymentSocket;
