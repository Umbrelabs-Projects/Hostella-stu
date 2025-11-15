import Footer from "@/components/footer/page";
import NavBar from "@/components/navbar/page";
import ChatBot from "../chatbot";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-poppins">
      <NavBar />
      {children}
      <ChatBot />
      <Footer />
    </div>
  );
}
