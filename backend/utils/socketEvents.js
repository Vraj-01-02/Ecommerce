import { getIO } from "../config/socket.js";

/* ================= EMIT TO ADMIN ROOM ================= */
export const emitToAdmins = (event, data) => {
    try {
        const io = getIO();
        io.to("admin-room").emit(event, data);
        console.log(`📡 Emitted '${event}' to admin-room`);
    } catch (error) {
        console.error("Socket emit error:", error.message);
    }
};

/* ================= EMIT TO SPECIFIC USER ================= */
export const emitToUser = (userId, event, data) => {
    try {
        const io = getIO();
        io.to(`user-${userId}`).emit(event, data);
        console.log(`📡 Emitted '${event}' to user-${userId}`);
    } catch (error) {
        console.error("Socket emit error:", error.message);
    }
};

/* ================= EMIT TO ALL USERS ================= */
export const emitToAll = (event, data) => {
    try {
        const io = getIO();
        io.emit(event, data);
        console.log(`📡 Emitted '${event}' to all clients`);
    } catch (error) {
        console.error("Socket emit error:", error.message);
    }
};
