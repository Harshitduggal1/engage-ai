"use client";

import { useState } from "react";
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

export default function PaymentCancelled() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden">
        <Card className="w-full max-w-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105 border border-opacity-20 border-purple-300">
          <CardHeader className="space-y-3 p-8">
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-5xl font-black tracking-tight text-center">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-gray-700 font-medium tracking-wide text-xl text-center">
              We couldn&apos;t process your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <p className="text-gray-800 font-semibold text-xl text-center leading-relaxed">
                To receive your analysis, please upload a PDF.
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:translate-x-1 transform">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong className="font-bold text-lg block mb-2">Note:</strong>
                  Your payment was cancelled. If you need assistance, please contact our support team.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8">
            <div className="flex flex-col w-full space-y-4">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white font-extrabold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-purple-300 group text-lg"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload for Full Analysis
                </span>
              </Button>
              <Button className="w-full bg-transparent text-gray-700 font-semibold hover:text-indigo-600 py-4 px-8 border-2 border-gray-300 hover:border-indigo-300 rounded-full transition-all duration-300 focus:ring-2 focus:ring-indigo-200 group text-lg" asChild variant="outline">
                <Link href="/dashboard">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Go to Dashboard
                  </span>
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-200 via-indigo-200 to-transparent transform -skew-y-6 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-blue-200 via-indigo-200 to-transparent transform skew-y-6 opacity-30"></div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
