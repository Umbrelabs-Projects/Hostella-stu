/**
 * AuthLayout component
 *
 * This component is a layout wrapper for authentication-related pages.
 * It includes a home navbar and footer, with the main content rendered
 * in between.
 * The auth layout is actually the same as the home layout but let's use auth layout for seperation of concerns.
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 */

import Footer from "@/components/footer/page";
import Navbar from "@/components/navbar/page";



export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
