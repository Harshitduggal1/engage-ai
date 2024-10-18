"use client";
import { useModalStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Sparkles, Lock, CheckCircle } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function googleSignIn(): Promise<void> {
  return new Promise((resolve) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    resolve();
  });
}

export function ConnectAccountModal() {
  const [isAgreed, setIsAgreed] = useState(false);
  const modalKey = "connectAccountModal";
  const { isOpen, closeModal } = useModalStore();

  const mutation = useMutation({
    mutationFn: googleSignIn,
    onSuccess: () => {
      closeModal(modalKey);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleGoogleSignIn = async () => {
    if (isAgreed) {
      mutation.mutate();
    } else {
      toast.error("Please agree to the terms and conditions");
    }
  };

  return (
    <Dialog
      open={isOpen(modalKey)}
      onOpenChange={() => closeModal(modalKey)}
      key={modalKey}
    >
      <DialogContent className="bg-white shadow-xl backdrop-blur-sm mx-auto p-6  border border-blue-600 rounded-full">
        <DialogHeader className="space-y-2">
          <DialogTitle className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-bold text-3xl text-transparent">
            Connect Google Account
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your Google account to access all features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={!isAgreed || mutation.isPending}
            className="bg-gradient-to-r from-blue-500 hover:from-blue-600 to-purple-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/50 py-2 rounded-md w-full font-semibold text-white transition-all duration-300"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 w-4 h-4" />
            )}
            Sign in with Google
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
              className="border-gray-400 focus:ring-blue-500 text-blue-500"
            />
            <Label
              htmlFor="terms"
              className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              I agree to the terms and conditions
            </Label>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <p className="font-medium text-center text-gray-400 text-sm">
            By connecting, you&apos;ll get access to:
          </p>
          <ul className="space-y-2">
            {["Seamless integration", "Enhanced features", "Personalized experience"].map((item, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-400 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="flex justify-center items-center text-gray-500 text-xs">
            <Lock className="mr-1 w-3 h-3" />
            Secure connection
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
