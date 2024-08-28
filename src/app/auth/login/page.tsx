"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../route";
const Page = () => {
  const LoginWithProvider = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  return (
    <div className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-4  w-6/12 shadow-md p-4">
      <button
      className="w-9/12 bg-black text-white shadow-lg rounded-md p-3 "
        type="button"
        onClick={() => {
          LoginWithProvider("google");
        }}
      >
        Login With Google
      </button>
      <button
      className="w-9/12 bg-black text-white shadow-lg rounded-md p-3"
        type="button"
        onClick={() => {
          LoginWithProvider("github");
        }}
      >
        Login With Github
      </button>
      </div>
    </div>
  );
};

export default Page;
