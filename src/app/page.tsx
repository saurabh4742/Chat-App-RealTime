"use client"
import { useSession ,signOut} from "next-auth/react";
import { redirect } from "next/navigation";
import { Lock } from 'lucide-react';
import ChatLayout from "@/components/ChatLayout";
export default function Home() {
  const session=useSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="w-full flex justify-between p-2 bg-[#FAFAF9] "><div className="font-bold ">Chat-With-SSR</div>{session.data?.user.id && <button className=" bg-black text-white shadow-lg rounded-md p-3" onClick={()=>{
        signOut()
      }}>Logout</button>}{!session.data?.user.id && <form action={()=>{
        redirect("/auth/login")
      }}>
        <button type="submit" className="w-full bg-black text-white shadow-lg rounded-md p-3" >Try now!</button></form>}</div>
      {!session.data?.user.id && <div className="flex flex-col justify-center w-full items-center h-[80vh]">
      <div className="font-semibold text-amber-950">Chat today, memories forever</div>
      <Lock className="text-muted-foreground  w-40 h-40"/>
      <p className="text-muted-foreground text-lg"> The service is locked please login first.</p>
      </div>}
      {session.data?.user.id && <>
        <ChatLayout/></>}
    </main>
  );
}
