"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import MainChat from "./MainChat";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface User {
  id: string;
  name: string | undefined;
  password: string | undefined;
  email: string | undefined;
  image: string | undefined;
}

const ChatLayout = () => {
  const session = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/getAllUser"); // Adjust the API endpoint accordingly
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full flex">
      <div className="h-[91vh] shadow-lg sm:flex sm:flex-col gap-2 blur-sm hover:blur-none ease-in bg-[#1C1917] hidden items-center justify-center overflow-y-scroll w-4/12 p-2">
        {/* Map through all users except the current user */}
        {users
          .filter((user) => user.id !== session.data?.user?.id)
          .map((user) => (
            <div
              key={user.id}
              className="w-full hover:bg-slate-300 cursor-pointer bg-transparent flex justify-center items-center shadow-lg rounded-xl"
              onClick={() => setSelectedUserId(user.id)}
            >
              <div className="flex justify-between gap-2 p-3">
                <Avatar className="relative">
                  <AvatarImage
                    src={
                      user.image ||
                      "https://avatars.githubusercontent.com/u/55929607?v=4"
                    }
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                  <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 z-auto border-2 border-background bg-green-600"></span>
                </Avatar>
                <div className="w-full justify-center flex text-muted-foreground flex-col">
                  {user.name || "Unknown User"}
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Pass the selected user ID to MainChat */}
      <MainChat id={selectedUserId} />
    </div>
  );
};

export default ChatLayout;
