// app/layout.tsx or app/layout.js
import type { Metadata } from "next";
import { Geist, Rajdhani, Share_Tech_Mono, JetBrains_Mono, Silkscreen } from "next/font/google";
import "../styles/globals.css";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import ClientLayout from "@/Components/ClientLayout";
import { SITE_NAME, SITE_URL } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  preload: false,
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const shareTechMono = Share_Tech_Mono({
  preload: false,
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

const jetbrainsMono = JetBrains_Mono({
  preload: false,
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const silkscreen = Silkscreen({
  preload: false,
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const description =
  "Bradley Charles: software engineer, cybersecurity analyst, project manager and artist building practical systems for real people.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description,
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Software Engineer",
  sameAs: ["https://github.com/BradleyCharles"],
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${rajdhani.variable} ${shareTechMono.variable} ${jetbrainsMono.variable} ${silkscreen.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
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
