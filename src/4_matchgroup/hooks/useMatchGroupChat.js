import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const useMatchGroupChat = (matchGroupId, isAuthorized, currentUser) => {
    const [stompClient, setStompClient] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!isAuthorized || !matchGroupId) return;

        const socket = new SockJS("http://localhost:8090/swings/ws");
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/topic/chat/${matchGroupId}`, (message) => {
                const received = JSON.parse(message.body);
                setMessages((prev) => [...prev, received]);
            });
            setStompClient(client);
        });

        return () => {
            if (client.connected) client.disconnect();
        };
    }, [isAuthorized, matchGroupId]);

    const sendMessage = () => {
        if (chatInput.trim() === "" || !stompClient || !currentUser) return;

        const chatMessage = {
            roomId: Number(matchGroupId),
            sender: currentUser.username,
            content: chatInput,
            sentAt: new Date().toISOString(),
        };

        stompClient.send(`/app/chat.send/${matchGroupId}`, {}, JSON.stringify(chatMessage));
        setChatInput("");
    };

    return {
        chatInput,
        setChatInput,
        messages,
        setMessages,
        sendMessage,
    };
};