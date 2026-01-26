import React, { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const SOCKET_URL = "http://localhost:4000";

const AdminContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  /* ================= SOCKET CONNECTION ================= */
  useEffect(() => {
    if (!token) {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        return;
    }

    try {
        const decoded = jwtDecode(token);
        const adminId = decoded.id;

        // Initialize socket
        const newSocket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            console.log("✅ Admin Socket Connected:", newSocket.id);
            newSocket.emit("joinAdmin", adminId);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Admin Socket Disconnected");
        });

        // Global Listeners
        newSocket.on("newOrder", (data) => {
             console.log("🔔 New order global:", data);
             
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    } catch (error) {
        console.error("Socket init error:", error);
    }
  }, [token]);

  return (
    <AdminContext.Provider value={{ socket, setToken, token }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
