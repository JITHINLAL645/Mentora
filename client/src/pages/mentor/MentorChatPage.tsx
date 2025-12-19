import { useEffect, useState, useRef } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import axios from "axios";
import { socket } from "../../services/socket";

const MentorChatPage = () => {
  const mentorId = localStorage.getItem("mentorId");

  const [mentees, setMentees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ============================
     🔹 Fetch booked mentees
     ============================ */
  const fetchMentees = async () => {
    if (!mentorId) return;

    try {
      const res = await axios.get(`/api/mentors/${mentorId}/booked-mentees`);
      setMentees(res.data);
    } catch (error) {
      console.error("❌ Error fetching mentees:", error);
    }
  };

  /* ============================
     🔹 Initial load
     ============================ */
  useEffect(() => {
    if (!mentorId) {
      console.log("❌ Mentor ID missing");
      return;
    }

    fetchMentees();
  }, [mentorId]);

  /* ============================
     🔹 Load messages on user click
     ============================ */
  const loadMessages = async (user: any) => {
    if (!mentorId || !user?._id) return;

    setSelectedUser(user);

    const roomId = [mentorId, user._id].sort().join("-");

    try {
      const res = await axios.get(`/api/chat/${roomId}`);
      setMessages(res.data);
      socket.emit("joinRoom", { roomId });
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  };

  /* ============================
     🔹 Receive socket messages
     ============================ */
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  /* ============================
     🔹 Send message
     ============================ */
  const sendMessage = () => {
    if (!mentorId) {
      console.log("❌ Mentor ID missing");
      return;
    }

    if (!selectedUser?._id) {
      console.log("❌ Mentee not selected");
      return;
    }

    if (!newMessage.trim()) {
      console.log("❌ Empty message");
      return;
    }

    const roomId = [mentorId, selectedUser._id].sort().join("-");

    if (!roomId || roomId === "-") {
      console.log("❌ Invalid roomId:", roomId);
      return;
    }

    socket.emit("sendMessage", {
      roomId,
      senderId: mentorId,
      receiverId: selectedUser._id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  /* ============================
     🔹 Auto scroll
     ============================ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen">
      <MentorSidebar />

      <div className="flex w-full">
        {/* LEFT – MENTEES */}
        <div className="w-1/4 border-r">
          {mentees.length === 0 ? (
            <p className="p-4 text-gray-500">No mentees found</p>
          ) : (
            mentees.map((m) => (
              <div
                key={m._id}
                onClick={() => loadMessages(m)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  selectedUser?._id === m._id ? "bg-gray-200" : ""
                }`}
              >
                {m.name}
              </div>
            ))
          )}
        </div>

        {/* RIGHT – CHAT */}
        <div className="w-3/4 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedUser ? (
              messages.map((msg) => (
                <div
                  key={msg._id || `${msg.senderId}-${msg.createdAt}`}
                  className="mb-2"
                >
                  <span className="px-3 py-1 rounded bg-gray-200">
                    {msg.message}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Select a mentee to start chat</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 flex border-t">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Type a message..."
              disabled={!selectedUser}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 bg-blue-600 text-white rounded"
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatPage;
