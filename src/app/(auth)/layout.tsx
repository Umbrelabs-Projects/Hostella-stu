"use client"
import Navbar from "@/components/navbar/page";
import { images } from "@/lib/images";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const showNavbar = pathname === "/signup" || pathname === "/login";
  return (
    <>
      {showNavbar && <Navbar />}
      <div className="flex flex-col md:flex-row md:h-screen ">
        {/* Left Side - Image */}
        <div
          className=" md:w-1/2 bg-cover bg-center h-[20rem] md:h-screen "
          style={{
            backgroundImage: `url(${images.room2.src})`,
          }}
        ></div>

        {/* Right Side - Auth pages */}
        <div className="absolute md:relative rounded-t-2xl md:rounded-none w-full mt-[12rem] md:my-8 md:w-1/2 flex items-center justify-center bg-white">
          {children}
        </div>
      </div>
    </>
  );
}
