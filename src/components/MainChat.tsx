"use client";
import React from "react";
import { Lock } from 'lucide-react';
const MainChat = () => {
  return (
    <div className="w-full h-[91vh] bg-[#A5F3FC]  sm:flex sm:flex-col  hidden">
      <div className="flex flex-col justify-center w-full items-center h-[80vh]">
      <div className="font-semibold">Chat today, memories forever</div>
      <Lock className="text-muted-foreground text-[#083344] w-40 h-40"/>
      <p className="text-muted-foreground text-lg"> Select any of the user to chat with.</p>
      </div>
    </div>
  );
};

export default MainChat;
