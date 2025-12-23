import { useEffect, useState, useRef } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import axios from "axios";
import { socket } from "../../services/socket";

const MentorChatPage = () => {
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [mentees, setMentees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Load mentorId
  useEffect(() => {
    const id = sessionStorage.getItem("mentorId");
    if (!id) {
      setError("Mentor ID not found. Please login again.");
      setLoading(false);
      return;
    }
    setMentorId(id);
  }, []);

  // 🔹 Fetch mentees (FIXED)
  const fetchMentees = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = sessionStorage.getItem("mentorToken");
      if (!token) throw new Error("Authentication token missing");

      const res = await axios.get(
        "/api/bookings/mentor/booked-mentees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ THIS IS THE FIX
      setMentees(res.data.mentees || []);
    } catch (err: any) {
      console.error("Fetch mentees error:", err);
      setError(err.response?.data?.message || err.message);
      setMentees([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Socket + initial load
  useEffect(() => {
    if (!mentorId) return;

    socket.emit("joinUser", mentorId);
    fetchMentees();

    return () => {
      socket.off("receiveMessage");
    };
  }, [mentorId]);

  // 🔹 Load messages
  const loadMessages = async (user: any) => {
    setSelectedUser(user);
    setMessages([]);

    const roomId = [mentorId, user._id].sort().join("-");
    const res = await axios.get(`/api/chat/${roomId}`);
    setMessages(res.data || []);

    socket.emit("joinRoom", { roomId });
  };

  // 🔹 Receive messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // 🔹 Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      roomId: [mentorId, selectedUser._id].sort().join("-"),
      senderId: mentorId,
      receiverId: selectedUser._id,
      message: newMessage,
    });

    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen">
      <MentorSidebar />

      <div className="flex w-full">
        {/* LEFT */}
        <div className="w-1/4 border-r bg-gray-50">
          <div className="p-4 font-semibold">My Mentees</div>

          {loading ? (
            <p className="p-4">Loading...</p>
          ) : error ? (
            <p className="p-4 text-red-500">{error}</p>
          ) : mentees.length === 0 ? (
            <p className="p-4">No mentees found</p>
          ) : (
            mentees.map((m) => (
              <div
                key={m._id}
                className="p-4 cursor-pointer hover:bg-blue-100"
                onClick={() => loadMessages(m)}
              >
                <p className="font-medium">{m.name}</p>
                <p className="text-xs">{m.email}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="w-3/4 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 ${
                  msg.senderId === mentorId ? "text-right" : "text-left"
                }`}
              >
                <span className="px-3 py-2 bg-blue-600 text-white rounded">
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selectedUser && (
            <div className="p-4 border-t flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border p-2"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorChatPage;
