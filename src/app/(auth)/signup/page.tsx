"use client";

import { images } from "@/lib/images";
import SignUpForm from "./components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div
        className=" md:w-1/2 bg-cover bg-center h-[20rem] md:h-screen "
        style={{
          backgroundImage: `url(${images.room2.src})`,
        }}
      ></div>

      {/* Right Side - Form */}
      <div className="absolute md:relative rounded-t-2xl md:rounded-none w-full mt-[12rem] md:my-8 md:w-1/2 flex items-center justify-center bg-white">
        <SignUpForm />
      </div>
    </div>
  );
}
