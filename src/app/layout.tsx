// app/layout.tsx or app/layout.js
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import BackToTop from "@/Components/BackToTop";
import ClientLayout from "@/Components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ClientLayout>
        <div className="root-layout">
          <Navbar />
          <main>{children}</main>
          <BackToTop />
          <Footer />
        </div>
      </ClientLayout>
      </body>
      </html>
  );
}
