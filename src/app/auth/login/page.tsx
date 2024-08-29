"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../route";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
const Page = () => {
  const LoginWithProvider = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <div className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-4 sm:w-fit w-full shadow-md sm:p-10 p-2">
      <button
      className=" bg-black text-white shadow-lg rounded-md p-3 flex gap-2 justify-center w-full items-center"
        type="button"
        onClick={() => {
          LoginWithProvider("google");
        }}
      >
        Login With Google <FcGoogle size={22} />
      </button>
      <button
      className=" bg-black text-white shadow-lg rounded-md p-3 sm:w-fit w-full flex gap-2 justify-center items-center"
        type="button"
        onClick={() => {
          LoginWithProvider("github");
        }}
      >
        Login With Github <FaGithub  size={22} />
      </button>
      </div>
    </div>
  );
};

export default Page;
