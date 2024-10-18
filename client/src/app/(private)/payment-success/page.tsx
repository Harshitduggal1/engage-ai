"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UploadModal } from "@/components/modals/upload-modal";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";

export default function PaymentSuccess() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <>
      <div className="flex justify-center items-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 min-h-screen overflow-hidden">
        <Card className="border-purple-300 bg-white bg-opacity-80 shadow-2xl hover:shadow-[0_0_100px_rgba(192,38,211,0.3)] backdrop-blur-xl backdrop-filter border border-opacity-20 rounded-3xl w-full max-w-md transition-all duration-500 hover:scale-105">
          <CardHeader className="relative space-y-4 p-8 overflow-hidden">
          <Confetti
        ref={confettiRef}
        className="top-0 left-0 z-0 absolute size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 animate-gradient-x"></div>
            <CardTitle className="relative z-10 bg-clip-text bg-gradient-to-r from-emerald-800 via-green-600 to-teal-600 font-black text-5xl text-center text-transparent tracking-tight">
              Payment Successful
            </CardTitle>
            <CardDescription className="relative z-10 font-medium text-center text-gray-600 text-xl tracking-wide">Thank you for your payment.</CardDescription>
          </CardHeader>
          <CardContent className="relative p-8">
            <div className="space-y-8">
              <p className="font-semibold text-2xl text-center text-gray-700 leading-relaxed">To receive your analysis, you need to upload a PDF.</p>
              <div className="bg-gradient-to-r from-blue-50 hover:from-blue-100 to-indigo-50 hover:to-indigo-100 hover:shadow-xl p-6 border-blue-500 border-l-4 rounded-2xl transform transition-all hover:translate-x-1 duration-300">
                <div className="flex items-center">
                  <p className="text-blue-800 text-left text-lg">
                    <strong className="block mb-2 font-bold text-xl">Note:</strong>
                    You can upload your contract in PDF or DXS format.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8">
            <div className="flex flex-col space-y-4 w-full">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="relative bg-gradient-to-r from-purple-500 hover:from-purple-600 via-pink-500 hover:via-pink-600 to-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 px-8 py-6 rounded-full focus:ring-4 focus:ring-purple-500/50 w-full font-extrabold text-lg text-white transform transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative z-10 flex justify-center items-center">
                  <svg className="mr-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload for Full Analysis
                </span>
              </Button>
              <Button className="relative border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 px-8 py-6 rounded-full focus:ring-2 focus:ring-gray-300 w-full font-semibold text-gray-700 text-lg hover:text-gray-900 transition-all duration-300 overflow-hidden group" asChild variant="outline">
                <Link href="/dashboard">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex justify-center items-center">
                    <svg className="mr-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Go to Dashboard
                  </span>
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-300 to-blue-300 opacity-30 animate-pulse"></div>
        <div className="top-0 left-0 absolute bg-gradient-to-b from-purple-200 via-pink-200 to-transparent opacity-30 -skew-y-6 w-full h-96 transform"></div>
        <div className="right-0 bottom-0 absolute bg-gradient-to-t from-blue-200 via-indigo-200 to-transparent opacity-30 skew-y-6 w-full h-96 transform"></div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
