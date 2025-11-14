import type { Metadata } from "next";
import { Comfortaa, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hostella",
  description: "Your description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div
          style={{
            fontFamily: `${poppins.style.fontFamily}, ${comfortaa.style.fontFamily}`,
          }}
        >
          {children}
        </div>

        <Toaster position="top-right" richColors />
        {/* <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6916768ed020ac1958843492/1j9vru7pa';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
