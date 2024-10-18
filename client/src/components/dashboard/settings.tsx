import React from 'react';
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Settings() {
  const {
    subscriptionStatus,
    isSubscriptionLoading,
    isSubscriptionError,
    setLoading,
  } = useSubscription();
  const { user } = useCurrentUser();

  if (!subscriptionStatus || !user) {
    return null;
  }

  const isActive = subscriptionStatus.status === "active";

  const handleUpgrade = async () => {
    if (isActive) {
      toast.error("You are already a premium member");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      toast.error("Please try again or login to your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personal Info</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  value={user.displayName}
                  id="name"
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  value={user.email}
                  id="email"
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-700 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 bg-gradient-to-r from-fuchsia-400 to-purple-600 bg-clip-text text-transparent" />
                  Your account is managed through Google. Contact us for email changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isActive ? (
            <Card className="bg-gradient-to-br from-emerald-400/20 to-blue-500/20 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/10">
              <CardHeader className="space-y-2 p-6">
                <CardTitle className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-blue-300">Premium</CardTitle>
                <CardDescription className="text-lg font-medium text-emerald-200">Your elite membership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/10 p-2 pr-4 text-sm font-bold text-white">
                      <div className="rounded-full bg-emerald-500 p-1">
                        <Check size={20} className="text-black" />
                      </div>
                      Active
                    </div>
                    <p className="text-sm font-medium text-emerald-200">
                      Lifetime access granted
                    </p>
                  </div>
                </div>
                <Separator className="bg-white/20" />
                <div className="space-y-3">
                  <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                    Thank you for your support!
                  </p>
                  <p className="text-lg font-medium text-blue-200">
                    Enjoy premium benefits. You&apos;re extraordinary!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
              <CardHeader className="space-y-2 p-6">
                <CardTitle className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Unlimited Access</CardTitle>
                <CardDescription className="text-lg font-medium text-gray-400">
                  Upgrade to premium for boundless features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <ul className="space-y-4">
                  {[
                    "Unlimited access to all features",
                    "Priority customer support",
                    "Early access to new features",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-500/20 p-1">
                        <Check size={20} className="text-indigo-400" />
                      </div>
                      <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  className="w-full text-xl font-black py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={handleUpgrade}
                >
                  Get Lifetime Access
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
