"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowDown, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { useSocket } from "./SocketContex";
interface MessageData {
  id: string;
  senderId: string;
  receiver: string;
  message: string;
  attachmentUrl?: string;
  sentAt: Date;
}
const MainChat = ({id}:{id:string}) => {
  const session = useSession();
  const socket = useSocket();
  const [username, setUsername] = useState("");
  const [imageUrl, setImageurl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [oldmessages, setOldMessages] = useState<MessageData[]>([]);
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
    useEffect(() => {
      if (session?.data?.user?.id && socket && id) {
        socket.connect();
        socket.emit("set_user_id", session?.data?.user?.id);
        socket.on(
          "user-detail",
          (data: { username: string; imageUrl: string }) => {
            setUsername(data.username);
            setImageurl(data.imageUrl);
          }
        );
        socket.on("Giving_old_chats", (data) => {
          setOldMessages(data);
        });
        socket.emit("Give_Me_old_chats");
        socket.emit("check_already_online_status")
        socket.on("already_online_status", (status) => {
          setOnlineStatus(status);
        });
        socket.on(
          "user_online_status",
          (data: { userId: string; status: boolean }) => {
            if (data.userId === id) {
              setOnlineStatus(data.status);
            }
          }
        );
      }
  
      return () => {
        if (socket) {
          socket.off("Giving_old_chats");
          socket.off("online_status");
          socket.off("user-detail");
        }
      };
    }, [id, session?.data?.user?.id, socket]);
  return (
    <div className="w-full h-[91vh] sm:flex sm:flex-col  hidden">
      <div className="w-full min-h-[10vh] bg-[#E7E5E4]  ">
        <div className="flex justify-between gap-2    p-3 ">
          <Avatar className="relative">
            <AvatarImage
              src={
                session?.data?.user?.image ||
                "https://avatars.githubusercontent.com/u/55929607?v=4"
              }
            />
            <AvatarFallback>S</AvatarFallback>
            <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 z-auto border-2 border-background bg-green-600"></span>
          </Avatar>
          <div className="w-full justify-center  flex text-muted-foreground flex-col ">
            Saurabh Anand
          </div>
        </div>
      </div>
      <div className="h-[75vh] w-full flex flex-col p-4 overflow-y-scroll ">
        {/* chat by other user */}
        <div className="w-3/12 bg-[#F5F5F4] rounded-lg p-4 flex justify-center items-center">
          Hey! There How Are You Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptatum, non.
        </div>
        {/* chatted by me */}
        <div className=" flex justify-end items-center">
          <div className="w-3/12 bg-[#0C0A09] text-[#F5F5F4] rounded-lg p-4 flex justify-center items-center">
            Hey! There How Are You Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptatum, non.
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
      <div className="absolute bottom-20 flex justify-center items-center">
          <button className="p-2 shadow-md rounded-full bg-[#F59E0B]" onClick={scrollToLastMessage}>
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className=" w-full">
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
