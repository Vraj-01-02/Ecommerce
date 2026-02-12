import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = "http://localhost:4000";

const useSocket = (onOrderUpdate) => {
    const socketRef = useRef(null);
    const onOrderUpdateRef = useRef(onOrderUpdate);

    // Keep ref in sync with latest callback
    useEffect(() => {
        onOrderUpdateRef.current = onOrderUpdate;
    }, [onOrderUpdate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Prevent multiple socket connections
        if (socketRef.current?.connected) {
            console.log("⚠️ Socket already connected, skipping...");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            // Initialize socket connection
            socketRef.current = io(SOCKET_URL, {
                transports: ["websocket", "polling"],
            });

            const socket = socketRef.current;

            // Connection events
            socket.on("connect", () => {
                console.log("✅ Socket connected:", socket.id);
                socket.emit("joinUser", userId);
            });

            socket.on("disconnect", () => {
                console.log("❌ Socket disconnected");
            });

            // Listen for order confirmation - use ref to get latest callback
            socket.on("orderConfirmed", (data) => {
                console.log("✅ Order confirmed:", data);
                if (onOrderUpdateRef.current) onOrderUpdateRef.current("confirmed", data);
            });

            // Listen for order status updates - use ref to get latest callback
            socket.on("orderStatusUpdate", (data) => {
                console.log("📦 Order status updated:", data);
                if (onOrderUpdateRef.current) onOrderUpdateRef.current("statusUpdate", data);
            });

            // Cleanup on unmount
            return () => {
                console.log("🧹 Cleaning up socket connection");
                socket.disconnect();
                socketRef.current = null;
            };
        } catch (error) {
            console.error("Socket connection error:", error);
        }
    }, []); // Empty deps - socket created only once!

    return socketRef.current;
};

export default useSocket;
