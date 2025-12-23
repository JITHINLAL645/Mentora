import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import axios from "axios";
import { socket } from "../../services/socket";

const MenteeChatPage: React.FC = () => {
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Initialize menteeId
  useEffect(() => {
    const id = localStorage.getItem("userId");
    console.log("📋 Retrieved userId from localStorage:", id);
    
    if (!id) {
      setError("User ID not found. Please login again.");
      setLoading(false);
      return;
    }
    
    setMenteeId(id);
  }, []);

  // 🔹 Fetch booked mentors
  const fetchBookedMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple token keys
      const token = localStorage.getItem("token") || 
                    localStorage.getItem("authToken") || 
                    localStorage.getItem("userToken");
      
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      console.log("🔑 Using token:", token.substring(0, 20) + "...");

      const res = await axios.get("/api/bookings/my-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Bookings response:", res.data);

      if (!res.data.sessions || res.data.sessions.length === 0) {
        setMentors([]);
        setLoading(false);
        return;
      }

      // Extract unique mentors from sessions
      const uniqueMentors = Array.from(
        new Map(
          res.data.sessions
            .filter((s: any) => s.status !== 'Cancelled') // Filter out cancelled sessions
            .map((s: any) => {
              // The mentor object should be in the session
              const mentor = s.mentor || s.mentorId;
              return [mentor._id || mentor, mentor];
            })
        ).values()
      );

      console.log("✅ Unique mentors:", uniqueMentors);
      setMentors(uniqueMentors);
      setLoading(false);
    } catch (error: any) {
      console.error("❌ Error fetching mentors:", error);
      
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        // Optionally redirect to login after a delay
        setTimeout(() => {
          // window.location.href = "/login";
        }, 2000);
      } else if (error.message.includes("token not found")) {
        setError("Please login to view your mentors.");
      } else {
        setError(error.response?.data?.message || error.message || "Failed to fetch mentors");
      }
      
      setLoading(false);
    }
  };

  // 🔹 Socket connection setup
  useEffect(() => {
    if (!menteeId) return;

    console.log("🔌 Setting up socket for mentee:", menteeId);

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      socket.emit("joinUser", menteeId);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    // Check if already connected
    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Fetch mentors
    fetchBookedMentors();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [menteeId]);

  // 🔹 Load messages when mentor is selected
  const loadMessages = async (mentor: any) => {
    if (!menteeId) {
      console.error("❌ Cannot load messages: menteeId is missing");
      return;
    }

    setSelectedMentor(mentor);
    setMessages([]);

    const roomId = [menteeId, mentor._id].sort().join("-");
    console.log("📂 Loading messages for room:", roomId);

    try {
      const res = await axios.get(`/api/chat/${roomId}`);
      console.log("✅ Messages loaded:", res.data.length);
      setMessages(res.data);
      
      socket.emit("joinRoom", { roomId });
      console.log(`✅ Joined room: ${roomId}`);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  };

  // 🔹 Receive messages via socket
  useEffect(() => {
    const handleReceiveMessage = (msg: any) => {
      console.log("📩 Received message:", msg);
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // 🔹 Send message
  const sendMessage = () => {
    if (!menteeId) {
      console.error("❌ Mentee ID missing");
      alert("User ID not found. Please refresh the page.");
      return;
    }

    if (!selectedMentor?._id) {
      console.error("❌ No mentor selected");
      return;
    }

    if (!newMsg.trim()) {
      console.error("❌ Empty message");
      return;
    }

    if (!isConnected) {
      alert("Not connected to chat server. Please refresh the page.");
      return;
    }

    const roomId = [menteeId, selectedMentor._id].sort().join("-");

    const messageData = {
      roomId,
      senderId: menteeId,
      receiverId: selectedMentor._id,
      message: newMsg.trim(),
    };

    console.log("📤 Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    setNewMsg("");
  };

  // 🔹 Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🔹 Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Navbar />

      <div className="flex h-[600px] mx-[8%] mt-6 border rounded shadow-lg">
        {/* LEFT SIDEBAR - Mentors List */}
        <div className="w-1/4 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-lg">My Mentors</h2>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-1">● Disconnected</p>
            )}
            {isConnected && (
              <p className="text-xs text-green-500 mt-1">● Connected</p>
            )}
          </div>

          <div className="overflow-y-auto" style={{ height: "calc(100% - 70px)" }}>
            {loading ? (
              <p className="p-4 text-gray-500 text-center">Loading mentors...</p>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-500 text-sm mb-2">{error}</p>
                <button
                  onClick={fetchBookedMentors}
                  className="text-blue-600 text-sm underline hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            ) : mentors.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No mentors found</p>
                <p className="text-xs text-gray-400 mt-2">
                  Book a session with a mentor to start chatting
                </p>
              </div>
            ) : (
              mentors.map((m) => (
                <div
                  key={m._id}
                  onClick={() => loadMessages(m)}
                  className={`p-4 cursor-pointer border-b hover:bg-blue-50 transition ${
                    selectedMentor?._id === m._id
                      ? "bg-blue-100 border-l-4 border-l-blue-600"
                      : ""
                  }`}
                >
                  <p className="font-medium">{m.fullName || m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Chat Area */}
        <div className="w-3/4 flex flex-col bg-white">
          {selectedMentor && (
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-lg">
                {selectedMentor.fullName || selectedMentor.name}
              </h3>
              <p className="text-sm text-gray-500">{selectedMentor.email}</p>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {!selectedMentor ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select a mentor to start chatting</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === menteeId;
                return (
                  <div
                    key={msg._id || `${msg.senderId}-${msg.createdAt}-${index}`}
                    className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMe ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  selectedMentor
                    ? "Type a message..."
                    : "Select a mentor first"
                }
                disabled={!selectedMentor || !isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!selectedMentor || !newMsg.trim() || !isConnected}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MenteeChatPage;