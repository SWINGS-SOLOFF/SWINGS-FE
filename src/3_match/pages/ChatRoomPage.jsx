import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "../../1_user/api/axiosInstance";
import { fetchChatMessages } from "../api/chatRoomApi";
import { fetchUserData } from "../../1_user/api/userApi";
import { MoreVertical } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { IoIosArrowBack } from "react-icons/io";

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false); // 나가기 모달
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const markMessagesAsRead = async (roomId, username) => {
    try {
      await axios.post("/api/chat/messages/read", null, {
        params: { roomId, username },
      });
    } catch (err) {
      console.error("❌ 읽음 처리 실패:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserData();
        setCurrentUser(user);

        const res = await fetchChatMessages(roomId);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const formatted = data;

        setMessages(formatted);
        await markMessagesAsRead(roomId, user.username);
      } catch (err) {
        console.error("❌ 유저 또는 메시지 로딩 실패:", err);
      }
    };

    loadData();

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8090/swings/ws"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const newMsg = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMsg]);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected || !currentUser) return;

    const msg = {
      roomId: roomId,
      sender: currentUser.username,
      content: input,
    };

    clientRef.current.publish({
      destination: "/app/chat/message",
      body: JSON.stringify(msg),
    });

    setInput("");
  };

  const leaveChatRoom = async () => {
    if (!currentUser) return;
    try {
      await axios.post("/api/chat/leave", null, {
        params: { roomId, username: currentUser.username },
      });

      // SYSTEM 메시지 전송
      clientRef.current?.publish({
        destination: "/app/chat/message",
        body: JSON.stringify({
          roomId,
          sender: "SYSTEM",
          content: `${currentUser.username}님이 나가셨습니다.`,
        }),
      });

      navigate("/swings/chat");
    } catch (err) {
      console.error("❌ 채팅방 나가기 실패", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로그인된 유저 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="fixed top-0 left-0 w-full h-14 bg-white px-4 flex justify-between items-center shadow z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-black"
          >
            <IoIosArrowBack size={24} />
          </button>
          <h1 className="text-lg font-bold relative -top-[1px]">채팅방</h1>
        </div>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="text-gray-600 hover:text-black"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* ✅ 메시지 목록 */}
      <div className="absolute top-14 bottom-24 overflow-y-auto w-full p-4">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === currentUser.username;

          if (msg.sender === "SYSTEM") {
            return (
              <div key={idx} className="flex justify-center my-4">
                <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm shadow text-center">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`mb-5 flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs ${isMe ? "text-right" : "text-left"}`}>
                <p
                  className={`mb-2 text-sm font-semibold ${
                    isMe ? "text-custom-pink" : "text-gray-700"
                  }`}
                >
                  {msg.senderName || msg.sender}
                </p>
                <div
                  className={`inline-block px-4 font-bold py-2 rounded-xl text-sm break-words ${
                    isMe
                      ? "bg-custom-pink text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.sentAt && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ 입력창 */}
      <div className="absolute bottom-12 left-0 w-full p-4 bg-white flex items-center mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요..."
          className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2 text-gray-900 placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          className="bg-custom-pink  text-white px-4 py-2 rounded font-bold"
        >
          전송
        </button>
      </div>

      {/* ✅ 나가기 모달 */}
      {showLeaveModal && (
        <ConfirmModal
          message="채팅방을 나가시겠어요?"
          cancelLabel="취소"
          confirmLabel="나가기"
          onConfirm={() => {
            setShowLeaveModal(false);
            leaveChatRoom();
          }}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
    </div>
  );
};

export default ChatRoomPage;
