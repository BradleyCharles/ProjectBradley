// app/layout.tsx or app/layout.js
import type { Metadata } from "next";
import { Geist, Geist_Mono, Rajdhani, Share_Tech_Mono, Oswald } from "next/font/google";
import "../styles/globals.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import ClientLayout from "@/Components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

const oswald = Oswald({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Bradley Charles",
  description: "Created by Bradley Charles",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} ${shareTechMono.variable} ${oswald.variable}`}>
      <ClientLayout>
        <div className="root-layout">
          <Navbar />
          <main>{children}</main>
<Footer />
        </div>
      </ClientLayout>
      </body>
      </html>
  );
}
