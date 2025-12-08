// src/pages/mentor/MentorChatPage.tsx
import React, { useEffect, useState, useRef } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import { socket } from "../../services/socket";
import axios from "axios";

const MentorChatPage: React.FC = () => {
  const [mentees, setMentees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: replace this with your mentor auth data
  const mentorId = localStorage.getItem("mentorId") || "";

  // Fetch mentees list
  const fetchMentees = async () => {
    try {
      const res = await axios.get(`/api/mentors/mentees/${mentorId}`);
      setMentees(res.data);
    } catch (err) {
      console.log("Error fetching mentees", err);
    }
  };

  useEffect(() => {
    fetchMentees();
  }, []);

  // Initialize socket
  useEffect(() => {
    if (!mentorId) return;

    socket.emit("joinRoom", { roomId: mentorId });
  }, [mentorId]);

  // When clicking mentee → load chat
  const loadMessages = async (user: any) => {
    setSelectedUser(user);
    setLoadingMessages(true);

    const roomId = `${mentorId}-${user._id}`;

    try {
      const res = await axios.get(`/api/chat/${roomId}`);
      setMessages(res.data);
    } catch (err) {
      console.log("Error loading messages", err);
    }

    socket.emit("joinRoom", { roomId });
    setLoadingMessages(false);
  };

  // Receive messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send Message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const roomId = `${mentorId}-${selectedUser._id}`;
    const msgData = {
      roomId,
      senderId: mentorId,
      receiverId: selectedUser._id,
      message: newMessage,
    };

    // update UI instantly
    setMessages((prev) => [
      ...prev,
      { ...msgData, createdAt: new Date() },
    ]);

    socket.emit("sendMessage", msgData);

    await axios.post("/api/chat", msgData);

    setNewMessage("");
  };

  // Auto scroll bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <MentorSidebar />

      {/* Main container */}
      <div className="flex w-full">
        {/* LEFT USERS LIST */}
        <div className="w-1/4 border-r bg-white shadow-sm overflow-y-auto">
          <h2 className="text-xl font-semibold p-4 border-b">Mentees</h2>
          {mentees.map((mentee) => (
            <div
              key={mentee._id}
              onClick={() => loadMessages(mentee)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center ${
                selectedUser?._id === mentee._id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={mentee.profileImage}
                className="w-10 h-10 rounded-full mr-3 object-cover"
                alt=""
              />
              <p className="font-medium">{mentee.name}</p>
            </div>
          ))}
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="w-3/4 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-white flex items-center">
            {selectedUser ? (
              <>
                <img
                  src={selectedUser.profileImage}
                  className="w-10 h-10 rounded-full mr-3"
                  alt=""
                />
                <h3 className="text-lg font-semibold">
                  {selectedUser.name}
                </h3>
              </>
            ) : (
              <h3 className="text-lg text-gray-500">
                Select a mentee to start chat
              </h3>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {loadingMessages ? (
              <p className="text-center text-gray-500 mt-10">
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                {selectedUser ? "No messages yet." : "Select a mentee"}
              </p>
            ) : (
              messages.map((msg, i) => {
                const isMine = msg.senderId === mentorId;
                return (
                  <div
                    key={i}
                    className={`flex mb-3 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${
                        isMine
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white flex">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Type a message..."
              value={newMessage}
              disabled={!selectedUser}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedUser}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full"
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
