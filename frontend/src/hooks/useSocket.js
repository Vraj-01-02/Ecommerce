import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = "http://localhost:4000";

const useSocket = (onOrderUpdate) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

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

            // Listen for order confirmation
            socket.on("orderConfirmed", (data) => {
                console.log("✅ Order confirmed:", data);
                if (onOrderUpdate) onOrderUpdate("confirmed", data);
            });

            // Listen for order status updates
            socket.on("orderStatusUpdate", (data) => {
                console.log("📦 Order status updated:", data);
                if (onOrderUpdate) onOrderUpdate("statusUpdate", data);
            });

            // Cleanup on unmount
            return () => {
                socket.disconnect();
            };
        } catch (error) {
            console.error("Socket connection error:", error);
        }
    }, [onOrderUpdate]);

    return socketRef.current;
};

export default useSocket;
