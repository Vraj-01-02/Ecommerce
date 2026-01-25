import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = "http://localhost:4000";

const useSocket = (onNewOrder, onOrderUpdate) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

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

            // Listen for new orders
            socket.on("newOrder", (data) => {
                console.log("🔔 New order received:", data);
                if (onNewOrder) onNewOrder(data);
            });

            // Listen for order updates (optional)
            socket.on("orderStatusUpdate", (data) => {
                console.log("📦 Order status updated:", data);
                if (onOrderUpdate) onOrderUpdate(data);
            });

            // Cleanup on unmount
            return () => {
                socket.disconnect();
            };
        } catch (error) {
            console.error("Socket connection error:", error);
        }
    }, [onNewOrder, onOrderUpdate]);

    return socketRef.current;
};

export default useSocket;
