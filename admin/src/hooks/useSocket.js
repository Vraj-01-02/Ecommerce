import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

/**
 * Admin socket hook - simplified to just return socket from context
 * Components should handle their own event listeners
 * This prevents duplicate listener issues
 */
const useSocket = () => {
    const { socket } = useContext(AdminContext);
    return socket;
};

export default useSocket;
