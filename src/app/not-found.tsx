"use client"
import { Redirect } from '@/actions/AllUser'
import React from 'react'

const Page = () => {
  return (
    <div className='flex min-h-screen justify-center flex-col gap-2 items-center'>
      <span className='font-bold text-xl'>404</span>Page does not exist
      <button type="submit" className=" bg-black text-white shadow-lg rounded-md p-3" onClick={()=>{
        Redirect("/");
      }}>Return Home</button>
    </div>
  )
}

export default Page
