import React, { useState, useEffect, useRef, useCallback } from "react";
import { getData, postData } from "../../api/service";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import BackButton from "../../component/BackButton";

const ChatScreen = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // Fungsi untuk scroll ke bawah
  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Fungsi untuk memuat chat dari API
  const fetchChats = useCallback(async () => {
    try {
      const res = await getData("Chat/getChatCS");
      if (res.code === 200) {
        const newChats = res.data;

        // Bandingkan untuk menghindari re-render yang tidak perlu
        if (
          newChats.length !== chats.length ||
          JSON.stringify(newChats.map((c) => c.id)) !==
            JSON.stringify(chats.map((c) => c.id))
        ) {
          setChats(newChats);
          // Scroll ke bawah saat initialLoading selesai dan ada chat
          if (initialLoading && newChats.length > 0) {
            scrollToBottom();
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      if (initialLoading) {
        alert(
          error.response?.data?.message || "Terjadi kesalahan saat memuat data."
        );
      }
    } finally {
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [chats, scrollToBottom, initialLoading]);

  // Effect untuk fetching data awal dan polling
  useEffect(() => {
    fetchChats(); // Panggil sekali saat mount

    const interval = setInterval(fetchChats, 5000); // Polling setiap 5 detik

    return () => clearInterval(interval); // Cleanup interval
  }, [fetchChats]);

  // EFFECT PENTING: Ini akan memanggil scrollToBottom setiap kali `chats` state berubah
  // Ini memastikan scroll otomatis saat mengirim pesan atau menerima pesan baru dari polling
  useEffect(() => {
    scrollToBottom();
  }, [chats, scrollToBottom]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const trimmedMessage = message.trim();
    const newMessage = {
      message: trimmedMessage,
      sender: "User",
      id: Date.now(), // ID sementara untuk optimistik update
      status: "sending",
      timestamp: new Date().toISOString(),
    };

    // Optimistically update UI
    setChats((prevChats) => [...prevChats, newMessage]);
    setMessage("");
    setIsSending(true);
    // scrollToBottom() akan otomatis dipanggil oleh useEffect di atas karena `chats` berubah

    try {
      const body = {
        message: trimmedMessage,
        image: "",
      };
      const res = await postData("Chat/sendChatCS", body);

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.id
            ? { ...chat, status: "sent", ...(res.data || {}) }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.message || "Gagal mengirim pesan.");
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.id ? { ...chat, status: "failed" } : chat
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white py-3 z-10">
        <BackButton title="Beres AI" />
      </div>

      {/* Chat Messages Area - Will take remaining height and be scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {initialLoading ? (
          <div className="text-center mt-10 text-gray-500 flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" /> Memuat chat...
          </div>
        ) : (
          <>
            {chats.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                Mulai percakapan Anda dengan Beres AI
              </div>
            )}
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${
                  chat.sender === "User" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-3 max-w-[80%] md:max-w-[70%] shadow-sm relative ${
                    chat.sender === "User"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words pr-6">{chat.message}</p>
                  {chat.sender === "User" && (
                    <span className="absolute bottom-1 right-2 text-xs opacity-70 flex items-center gap-1">
                      {chat.status === "sending" && (
                        <FaSpinner className="animate-spin text-white text-opacity-80" />
                      )}
                      {chat.status === "sent" && "✓"}
                      {chat.status === "failed" && "✗"}
                    </span>
                  )}
                  {/* Opsional: Tampilkan waktu jika ada */}
                  {/* {chat.timestamp && (
                    <span className="block text-right text-[10px] opacity-70 mt-1">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )} */}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input Section - Will stay at the bottom */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-md z-10">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSending || !message.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            aria-label="Kirim pesan"
            disabled={isSending || !message.trim()}
          >
            {isSending ? (
              <FaSpinner className="animate-spin text-xl" />
            ) : (
              <FaPaperPlane className="text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;