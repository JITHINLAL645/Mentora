import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import axios from "axios";
import { socket } from "../../services/socket";

const MenteeChatPage: React.FC = () => {
  const menteeId = localStorage.getItem("userId")!;
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Fetch booked mentors
  const fetchBookedMentors = async () => {
    const res = await axios.get("/api/bookings/my-sessions");
    const uniqueMentors = Array.from(
      new Map(
        res.data.sessions.map((s: any) => [s.mentor._id, s.mentor])
      ).values()
    );
    setMentors(uniqueMentors);
  };

  useEffect(() => {
    fetchBookedMentors();
    socket.emit("joinUser", menteeId);
  }, []);

  // 🔹 Load messages
  const loadMessages = async (mentor: any) => {
    setSelectedMentor(mentor);
    const roomId = [menteeId, mentor._id].sort().join("-");
    const res = await axios.get(`/api/chat/${roomId}`);
    setMessages(res.data);
    socket.emit("joinRoom", { roomId });
  };

  // 🔹 Receive messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // 🔹 Send message
  const sendMessage = () => {
    // 🔒 Safety checks
    if (!menteeId) {
      console.log("❌ Mentee ID missing");
      return;
    }

    if (!selectedMentor?._id) {
      console.log("❌ Mentor not selected");
      return;
    }

    if (!newMsg.trim()) {
      console.log("❌ Empty message");
      return;
    }

    // ✅ SAME roomId logic everywhere
    const roomId = [menteeId, selectedMentor._id].sort().join("-");

    if (!roomId || roomId === "-") {
      console.log("❌ Invalid roomId:", roomId);
      return;
    }

    // ✅ Emit only when everything is valid
    socket.emit("sendMessage", {
      roomId,
      senderId: menteeId,
      receiverId: selectedMentor._id,
      message: newMsg.trim(),
    });

    setNewMsg("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />

      <div className="flex h-[600px] mx-[8%] mt-6 border rounded">
        {/* Mentors */}
        <div className="w-1/4 border-r">
          <h2 className="p-4 font-semibold">My Mentors</h2>
          {mentors.map((m) => (
            <div
              key={m._id}
              onClick={() => loadMessages(m)}
              className="p-3 cursor-pointer hover:bg-gray-100"
            >
              {m.fullName}
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="w-3/4 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg._id || `${msg.senderId}-${msg.createdAt}`}
                className={`mb-2 ${
                  msg.senderId === menteeId ? "text-right" : "text-left"
                }`}
              >
                <span className="px-3 py-2 bg-gray-200 rounded inline-block">
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t flex">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 border rounded px-3"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 bg-blue-600 text-white rounded"
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
