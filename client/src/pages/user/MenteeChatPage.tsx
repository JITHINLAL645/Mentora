import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Mentor {
  _id: string;
  name: string;
  profileImage?: string;
}

interface ChatMessage {
  _id?: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}

const MenteeChatPage: React.FC = () => {
  const menteeId = localStorage.getItem("userId"); // <-- change if you store differently

  const [socket, setSocket] = useState<Socket | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mentors/all");
      setMentors(res.data.data);
    } catch (err) {
      console.log("Error fetching mentors", err);
    }
  };

  // Load messages of selected mentor
  const fetchConversation = async (mentorId: string) => {
    try {
      const roomId = `${menteeId}-${mentorId}`;

      const res = await axios.get(`http://localhost:5000/api/chat/${roomId}`);
      setMessages(res.data);
    } catch (err) {
      console.log("Error loading messages", err);
    }
  };

  // Init socket
  useEffect(() => {
    const s = io("http://localhost:5000", { withCredentials: true });
    s.emit("joinRoom", { roomId: menteeId });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Receive messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  // Select a mentor
  const handleSelectMentor = async (mentor: Mentor) => {
    setSelectedMentor(mentor);
    const roomId = `${menteeId}-${mentor._id}`;
    socket?.emit("joinRoom", { roomId });
    fetchConversation(mentor._id);
  };

  // Send message
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedMentor) return;

    const roomId = `${menteeId}-${selectedMentor._id}`;

    const payload = {
      roomId,
      senderId: menteeId!,
      receiverId: selectedMentor._id,
      message: newMsg,
    };

    // local push
    const tempMessage = { ...payload, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMsg("");

    try {
      await axios.post("http://localhost:5000/api/chat", payload);
      socket?.emit("sendMessage", payload);
    } catch (err) {
      console.log("Message send failed", err);
    }
  };

  // Load mentors initially
  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex h-[600px] mx-[8%] border border-gray-200 rounded-lg shadow-sm bg-white mt-6">
        {/* LEFT SIDEBAR */}
        <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-semibold p-4 border-b">Mentors</h2>

          {mentors.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No mentors available</p>
          ) : (
            mentors.map((m) => (
              <div
                key={m._id}
                className={`flex items-center p-3 border-b cursor-pointer hover:bg-teal-50 ${
                  selectedMentor?._id === m._id ? "bg-teal-100" : ""
                }`}
                onClick={() => handleSelectMentor(m)}
              >
                <img
                  src={m.profileImage}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <p className="font-medium">{m.name}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="w-3/4 flex flex-col justify-between">
          {/* TOP BAR */}
          <div className="flex items-center p-4 border-b bg-white">
            {selectedMentor?.profileImage && (
              <img
                src={selectedMentor.profileImage}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <span className="text-lg font-medium">
              {selectedMentor ? selectedMentor.name : "Select a mentor to chat"}
            </span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {selectedMentor ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.senderId === menteeId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[75%] text-white ${
                      msg.senderId === menteeId
                        ? "bg-teal-600 rounded-br-none"
                        : "bg-gray-300 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt || "").toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                Select a mentor to start chat
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BOX */}
          <div className="flex items-center p-4 border-t bg-white">
            <input
              className="flex-1 border px-4 py-2 rounded-full outline-none"
              placeholder="Write a message..."
              disabled={!selectedMentor}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 bg-teal-600 text-white px-4 py-2 rounded-full"
              onClick={sendMessage}
              disabled={!newMsg.trim() || !selectedMentor}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MenteeChatPage;
