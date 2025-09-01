import Footer from "@/components/footer/page";
import NavBar from "@/components/navbar/page";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-poppins">
      {/* <NavBar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
