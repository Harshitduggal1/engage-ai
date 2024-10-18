import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PaymentSucess() {
  return (
    <div className="flex flex-1 justify-center items-center w-full">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex justify-center w-full">
            <Check className="bg-green-500/30 p-2 rounded-full text-green-500 size-12" />
          </div>

          <div className="mt-3 sm:mt-5 w-full text-center">
            <h2 className="font-semibold text-xl">Payment Successfull</h2>
            <p className="mt-2 text-muted-foreground text-sm tracking-tight">
              Congrasts to your subscription. You can now create unlimted sites.
            </p>

            <Button asChild className="mt-5 w-full">
              <Link href="/dashboard">Go back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
