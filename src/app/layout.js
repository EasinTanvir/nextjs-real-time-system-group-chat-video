import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCookie } from "@/lib/cookies";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chatify | Real-time conversations",
  description: "Modern chat for teams and friends.",
};

export default async function RootLayout({ children }) {
  const sid = await getCookie("sid");

  const isAuthenticated = Boolean(sid);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}
