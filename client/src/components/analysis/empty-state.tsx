import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { UploadModal } from "../modals/upload-modal";

interface IEmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: IEmptyStateProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center mt-10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>To recieive your analysis, you need to upload an PDF.</p>
              <div className="bg-blue-50 p-4 border-blue-500 border-l-4">
                <div className="flex items-center">
                  <p className="text-blue-700 text-left text-sm">
                    <strong>Note:</strong>
                    <br />
                    You can upload your contract in PDF or DXS format.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col space-y-2 w-full">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 hover:from-blue-500 via-pink-600 hover:via-purple-700 to-fuchsia-500 hover:to-pink-400 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.8)] px-4 py-2 rounded-full font-bold text-white transform hover:scale-105 transition-all duration-300"
                >
                Upload for Full Analysis
              </Button>
              <Button className="w-full" asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => setIsUploadModalOpen(true)}
      />
    </>
  );
}