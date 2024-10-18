import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { PricingTable } from "@/app/components/shared/Pricing";
import prisma from "@/app/utils/db";

import { stripe } from "@/app/utils/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";





export default async function PricingPage() {

  
 
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Edit Subscription</CardTitle>
          <CardDescription>
            Click on the button below, this will give you the opportunity to
            change your payment details and view your statement at the same
            time.
          </CardDescription>
        </CardHeader>
        <CardContent>

     
        </CardContent>
      </Card>
    );
  }



