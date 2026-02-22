import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = "http://localhost:4000";
const MAX_RECONNECT_ATTEMPTS = 5;

const useSocket = (onOrderUpdate) => {
    const socketRef = useRef(null);
    const onOrderUpdateRef = useRef(onOrderUpdate);
    const reconnectAttemptsRef = useRef(0);

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

            console.log("🔌 Initializing User Socket...");

            // Initialize socket connection
            socketRef.current = io(SOCKET_URL, {
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
            });

            const socket = socketRef.current;

            // Connection events
            socket.on("connect", () => {
                console.log("✅ Socket connected:", socket.id);
                socket.emit("joinUser", userId);
                reconnectAttemptsRef.current = 0; // Reset on successful connection
            });

            socket.on("disconnect", (reason) => {
                console.log("❌ Socket disconnected:", reason);
                if (reason === "io server disconnect") {
                    // Server disconnected us, try to reconnect
                    socket.connect();
                }
            });

            socket.on("connect_error", (error) => {
                reconnectAttemptsRef.current++;
                console.error(`❌ Socket connection error (attempt ${reconnectAttemptsRef.current}):`, error.message);
                
                if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
                    console.error("🚫 Max reconnection attempts reached");
                }
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
