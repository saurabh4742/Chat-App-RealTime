"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import MainChat from "./MainChat";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {getAllUser,Redirect} from "@/actions/AllUser";
import { useSocket } from "./SocketContex";

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

const ChatLayout = () => {
  const session = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const socket = useSocket();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();
        console.log("Fetched users in frontend:", data); // Log the fetched users
        setUsers(data);
      } catch (error) {
        console.error("Error in fetching users on the frontend:", error);
      }
    };
    
    fetchUsers();
    socket?.on("current_online_usersID", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });
    return () => {
      socket?.off("current_online_usersID");
    };
  }, [session.data?.user,socket]);

  return (
    <div className="w-full flex">
      <div className="h-[91vh] shadow-lg sm:flex sm:flex-col gap-2 sm:blur-sm  sm:hover:blur-none ease-in bg-[#1C1917] items-center justify-center overflow-y-scroll sm:w-4/12 w-full p-2">
        {users
          .filter((user) => user.id !== session.data?.user?.id)
          .map((user) => (
            <div
              key={user.id}
              className="w-full hover:bg-slate-300 cursor-pointer bg-transparent flex justify-center items-center shadow-lg rounded-xl"
              onClick={() => {console.log(user.id)
                Redirect(`p-2-p-encrypted/`+user.id)
              }}
            >
              <div className="flex justify-between gap-2 p-3">
                <Avatar className="relative">
                  <AvatarImage
                    src={
                      user.image ||
                      "https://avatars.githubusercontent.com/u/55929607?v=4"
                    }
                  />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  <span className={`absolute bottom-0 right-0 rounded-full w-3 h-3 z-auto border-2 border-background ${onlineUsers.has(user.id) ? "bg-green-500" : "bg-red-500"}`}></span>
                </Avatar>
                <div className="w-full justify-center flex text-muted-foreground flex-col">
                  {user.name || "Unknown User"}
                </div>
              </div>
            </div>
          ))}
      </div>
      <MainChat  />
    </div>
  );
};

export default ChatLayout;
