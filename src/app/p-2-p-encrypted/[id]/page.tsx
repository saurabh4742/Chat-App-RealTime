"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useSocket } from "@/components/SocketContex";
import { useParams } from "next/navigation";

interface MessageData {
  id: string;
  senderId: string;
  receiver: string;
  message: string;
  attachmentUrl?: string;
  sentAt: Date;
}

const MainChat = () => {
  const id = useParams<{ id: string }>().id;
  const session = useSession();
  const socket = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [oldmessages, setOldMessages] = useState<MessageData[]>([]);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageurl] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && socket) {
      socket.emit("send_msg", newMessage);
      setNewMessage("");
    }
  };

  const scrollToLastMessage = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (socket && id) {
      socket.connect();
      socket.emit("set_user_id", id);

      socket.on("user-detail", (data: { name: string; image: string }) => {
        setUsername(data.name);
        setImageurl(data.image);
      });

      socket.on("Giving_old_chats", (data: MessageData[]) => {
        setOldMessages(data);
      });

      socket.on("receive_msg", (data: MessageData) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToLastMessage();
      });

      socket.emit("Give_Me_old_chats");
      socket.emit("check_already_online_status");
      socket.on("already_online_status", (status) => {
        setOnlineStatus(status);
      });

      socket.on("user_online_status", (data: { userId: string; status: boolean }) => {
        if (data.userId === id) {
          setOnlineStatus(data.status);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("Giving_old_chats");
        socket.off("online_status");
        socket.off("user-detail");
        socket.off("receive_msg");
      }
    };
  }, [id, session?.data?.user?.id, socket]);

  return (
    <div className="w-full min-h-screen sm:flex sm:flex-col">
      <div className="w-full min-h-[10vh] bg-[#E7E5E4]">
        <div className="flex justify-between gap-2 p-3">
          <Avatar className="relative shadow-md">
            <AvatarImage
              src={imageUrl || "https://avatars.githubusercontent.com/u/55929607?v=4"}
            />
            <AvatarFallback>{username.charAt(0) || "U"}</AvatarFallback>
            <span className={`absolute bottom-0 right-0 rounded-full w-3 h-3 z-auto border-2 border-background ${onlineStatus ? "bg-green-600" : "bg-gray-400"}`}></span>
          </Avatar>
          <div className="w-full justify-center flex text-muted-foreground flex-col">
            {username}
          </div>
        </div>
      </div>
      <div className="h-[75vh] w-full flex flex-col p-4 overflow-y-scroll">
        {/* Map through old messages */}
        {oldmessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === session.data?.user?.id ? "justify-end" : "justify-start"} items-center mb-2`}
          >
            <div
              className={`sm:w-3/12 w-6/12 rounded-lg p-4 ${msg.senderId === session.data?.user?.id ? "bg-[#0C0A09] text-[#F5F5F4]" : "bg-[#F5F5F4]"}`}
            >
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTimestamp(msg.sentAt)}</p>
            </div>
          </div>
        ))}
        {/* Map through new messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={lastMessageRef}
            className={`flex ${msg.senderId === session.data?.user?.id ? "justify-end" : "justify-start"} items-center mb-2`}
          >
            <div
              className={`sm:w-3/12 w-6/12 rounded-lg p-4 ${msg.senderId === session.data?.user?.id ? "bg-[#0C0A09] text-[#F5F5F4]" : "bg-[#F5F5F4]"}`}
            >
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTimestamp(msg.sentAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="absolute bottom-28  flex justify-center items-center">
          <button className="p-2 shadow-md rounded-full bg-[#F59E0B]" onClick={scrollToLastMessage}>
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="relative flex items-center gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border rounded-lg flex items-center h-9 resize-none overflow-hidden bg-background"
          />
          <div className="absolute right-20 top-8">
            <EmojiPicker
              onChange={(value) => {
                setNewMessage(newMessage + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
          <button onClick={handleSendMessage} className="h-full bg-black text-white shadow-lg rounded-md p-4">
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
