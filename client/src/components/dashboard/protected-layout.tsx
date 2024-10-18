"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader2, LockIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useModalStore } from "@/store/zustand";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-transparent h-screen">
        <div className="flex justify-center items-center bg-white/10 shadow-2xl hover:shadow-3xl backdrop-blur-xl p-8 rounded-3xl transition-all duration-300">
          <Loader2 className="mr-4 w-12 h-12 text-indigo-500 animate-spin" />
          <span className="bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 font-extrabold text-2xl text-transparent animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center bg-transparent h-screen">
        <AuthCard />
      </div>
    );
  }

  return <div className="bg-transparent min-h-screen">{children}</div>;
}

export default function AuthCard() {
  const { openModal } = useModalStore();

  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl hover:shadow-3xl backdrop-blur-2xl mx-auto border rounded-3xl w-full max-w-3xl transform transition-all duration-300 overflow-hidden hover:scale-105">
      <div className="flex sm:flex-row flex-col">
        <div className="flex justify-center items-center bg-gradient-to-br from-purple-600 to-blue-500 p-8 rounded-l-3xl sm:w-1/4">
          <LockIcon className="w-24 h-24 text-white animate-pulse" />
        </div>
        <div className="p-8 sm:w-3/4">
          <CardHeader className="space-y-2 px-0 pb-4">
            <CardTitle className="bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-black text-4xl text-transparent animate-text">
               Authentication Required{" "} 🔐
            </CardTitle>
            <CardDescription className="font-semibold text-gray-300 text-lg">
               You need to be logged in to access this page. Let&apos;s get you started! {" "}🌟
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-4">
            <div className="flex sm:flex-row flex-col gap-4">
              <Button
                onClick={() => openModal("connectAccountModal")}
                className="relative flex-1 bg-gradient-to-r from-blue-400 hover:from-purple-500 to-purple-500 hover:to-blue-400 shadow-lg hover:shadow-xl py-6 rounded-full font-extrabold text-lg text-white uppercase tracking-wider transform hover:scale-105 transition-all duration-300 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 text-sm">Continue with Google⚡️</span>
              </Button>
              <Link href={"/"} className="flex-1">
                <Button className="relative bg-gradient-to-r from-pink-400 hover:from-orange-400 to-orange-400 hover:to-pink-400 shadow-lg hover:shadow-xl py-6 rounded-full w-full font-extrabold text-lg text-white uppercase tracking-wider transform hover:scale-105 transition-all duration-300 overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400/50 to-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10"> Back to Home</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
