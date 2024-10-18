"use client";

import UserContracts from "@/components/dashboard/user-contracts";
import { UploadModal } from "@/components/modals/upload-modal";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div>

      <Button onClick={() => setIsUploadModalOpen(true)}>Upload Contract</Button>
      <UserContracts />
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadComplete={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
}
