import { Server } from "socket.io";

let io;

/* ================= INITIALIZE SOCKET.IO ================= */
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            credentials: true,
            methods: ["GET", "POST"],
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 45000,
    });

    /* ================= CONNECTION HANDLER ================= */
    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        /* ================= JOIN ADMIN ROOM ================= */
        socket.on("joinAdmin", (adminId) => {
            socket.join("admin-room");
            console.log(`👑 Admin ${adminId} joined admin-room`);
        });

        /* ================= JOIN USER ROOM ================= */
        socket.on("joinUser", (userId) => {
            socket.join(`user-${userId}`);
            console.log(`👤 User ${userId} joined user-${userId}`);
        });

        /* ================= DISCONNECT ================= */
        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

/* ================= GET SOCKET INSTANCE ================= */
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
