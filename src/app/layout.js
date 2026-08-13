import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCookie } from "@/lib/cookies";
import { SocketProvider } from "@/providers/SocketContext";
import Footer from "@/components/pages/landing/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SocketProvider>
          <ReactQueryProvider>
            <Navbar isAuthenticated={isAuthenticated} />
            {children}
          </ReactQueryProvider>
          <Toaster position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
