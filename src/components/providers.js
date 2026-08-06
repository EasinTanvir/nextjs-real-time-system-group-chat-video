"use client";
import { Toaster } from "react-hot-toast"; import { AuthProvider } from "@/providers/auth-provider";
export default function Providers({children}) { return <AuthProvider>{children}<Toaster position="top-right" /></AuthProvider>; }
