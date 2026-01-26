import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = "http://localhost:4000";

const useSocket = (onNewOrder, onOrderUpdate) => {
    const socketRef = useRef(null);
    const onNewOrderRef = useRef(onNewOrder);
    const onOrderUpdateRef = useRef(onOrderUpdate);

    // Keep refs in sync with latest callbacks
    useEffect(() => {
        onNewOrderRef.current = onNewOrder;
        onOrderUpdateRef.current = onOrderUpdate;
    }, [onNewOrder, onOrderUpdate]);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        // Prevent multiple socket connections
        if (socketRef.current?.connected) {
            console.log("⚠️ Socket already connected, skipping...");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const adminId = decoded.id;

            // Initialize socket connection
            socketRef.current = io(SOCKET_URL, {
                transports: ["websocket", "polling"],
            });

            const socket = socketRef.current;

            // Connection events
            socket.on("connect", () => {
                console.log("✅ Socket connected:", socket.id);
                socket.emit("joinAdmin", adminId);
            });

            socket.on("disconnect", () => {
                console.log("❌ Socket disconnected");
            });

            // Listen for new orders - use ref to get latest callback
            socket.on("newOrder", (data) => {
                console.log("🔔 New order received:", data);
                if (onNewOrderRef.current) onNewOrderRef.current(data);
            });

            // Listen for order updates - use ref to get latest callback
            socket.on("orderStatusUpdate", (data) => {
                console.log("📦 Order status updated:", data);
                if (onOrderUpdateRef.current) onOrderUpdateRef.current(data);
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
