import { useContext, useEffect, useRef } from "react";
import { AdminContext } from "../context/AdminContext";

const useSocket = (onNewOrder, onOrderUpdate) => {
    const { socket } = useContext(AdminContext);
    
    // Refs to keep callbacks stable
    const onNewOrderRef = useRef(onNewOrder);
    const onOrderUpdateRef = useRef(onOrderUpdate);

    useEffect(() => {
        onNewOrderRef.current = onNewOrder;
        onOrderUpdateRef.current = onOrderUpdate;
    }, [onNewOrder, onOrderUpdate]);

    useEffect(() => {
        if (!socket) return;

        const handleNewOrder = (data) => {
            if (onNewOrderRef.current) onNewOrderRef.current(data);
        };

        const handleOrderUpdate = (data) => {
             if (onOrderUpdateRef.current) onOrderUpdateRef.current(data);
        };

        socket.on("newOrder", handleNewOrder);
        socket.on("orderStatusUpdate", handleOrderUpdate);

        return () => {
            socket.off("newOrder", handleNewOrder);
            socket.off("orderStatusUpdate", handleOrderUpdate);
        };
    }, [socket]);

    return socket;
};

export default useSocket;
