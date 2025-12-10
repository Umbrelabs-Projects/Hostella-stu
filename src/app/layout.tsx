import type { Metadata, Viewport } from "next";
import { Comfortaa, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ServiceWorkerRegister from "./sw-register";
import InstallPrompt from "@/components/pwa/InstallPrompt";

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
  title: "Hostella - Student Accommodation Platform",
  description: "Feel at Home for Academic Excellence - Book student accommodation with ease",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hostella",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Hostella",
    title: "Hostella - Student Accommodation Platform",
    description: "Feel at Home for Academic Excellence - Book student accommodation with ease",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#facc15",
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
        <ServiceWorkerRegister />
        <InstallPrompt />
        
      </body>
    </html>
  );
}
