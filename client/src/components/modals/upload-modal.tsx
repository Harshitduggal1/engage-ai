import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, FileText, Loader2, Sparkles, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";

interface IUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: IUploadModalProps) {
  const { setAnalysisResults } = useContractStore();
  const router = useRouter();

  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<
    "upload" | "detecting" | "confirm" | "processing" | "done"
  >("upload");

  const { mutate: detectContractType } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("contract", file);

      const response = await api.post<{ detectedType: string }>(
        `/contracts/detect-type`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.detectedType;
    },

    onSuccess: (data: string) => {
      setDetectedType(data);
      setStep("confirm");
    },
    onError: (error) => {
      console.error(error);
      setError("Failed to detect contract type");
      setStep("upload");
    },
  });

  const { mutate: uploadFile, isPending: isProcessing } = useMutation({
    mutationFn: async ({
      file,
      contractType,
    }: {
      file: File;
      contractType: string;
    }) => {
      const formData = new FormData();
      formData.append("contract", file);
      formData.append("contractType", contractType);

      const response = await api.post(`/contracts/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      setStep("done");
      onUploadComplete();
    },
    onError: (error) => {
      console.error(error);
      setError("Failed to upload contract");
      setStep("upload");
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      setError(null);
      setStep("upload");
    } else {
      setError("No file selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleFileUpload = () => {
    if (files.length > 0) {
      setStep("detecting");
      detectContractType(files[0]);
    }
  };

  const handleAnalyzeContract = () => {
    if (files.length > 0 && detectedType) {
      setStep("processing");
      uploadFile({ file: files[0], contractType: detectedType });
    }
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
    setDetectedType(null);
    setError(null);
    setStep("upload");
  };

  const renderContent = () => {
    switch (step) {
      case "upload": {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 mt-8 mb-4 text-center transition-all duration-300 ease-in-out",
                  isDragActive
                    ? "border-primary bg-primary/10 shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "border-gray-300 hover:border-gray-400 hover:shadow-md hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600"
                )}
              >
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <FileText className="mx-auto text-primary size-16" />
                </motion.div>
                <p className="mt-4 font-medium text-gray-600 text-sm">
                  Drag &apos;n&apos; drop some files here, or click to select files
                </p>
                <p className="border-yellow-500 bg-clip-text bg-yellow-500/30 bg-gradient-to-r from-yellow-600 to-amber-500 mt-2 p-2 border border-dashed rounded font-medium text-transparent">
                  Note: Only PDF files are accepted
                </p>
              </div>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center border-green-500 bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mt-4 p-2 border border-dashed rounded text-transparent"
                >
                  <span>
                    {files[0].name}{" "}
                    <span className="text-gray-600 text-sm">
                      ({files[0].size} bytes)
                    </span>
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="hover:bg-green-500 transition-colors duration-300"
                    onClick={() => setFiles([])}
                  >
                    <Trash className="hover:text-green-900 transition-colors duration-300 size-5" />
                  </Button>
                </motion.div>
              )}
              {files.length > 0 && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Button
                    className="relative bg-gradient-to-r from-purple-600 hover:from-purple-700 to-indigo-600 hover:to-indigo-700 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] mt-4 mb-4 px-6 py-3 rounded-full w-full font-bold text-white transform transition-all duration-300 overflow-hidden ease-in-out hover:scale-105 group"
                    onClick={handleFileUpload}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex justify-center items-center">
                      <Sparkles className="mr-2 text-yellow-300 animate-pulse size-5" />
                      <span className="group-hover:from-green-600 group-hover:to-white bg-clip-text bg-gradient-to-r from-white to-gray-200 text-transparent transition-all duration-300">
                        Analyze Contract With AI
                      </span>
                    </div>
                    <div className="absolute inset-0 border-white/20 group-hover:border-white/40 border rounded-full transition-colors duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        );
      }
      case "detecting": {
        return (
          <AnimatePresence>
            <motion.div
              className="flex flex-col justify-center items-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Loader2 className="text-primary animate-spin size-16" />
              <motion.p
                className="bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mt-4 font-semibold text-lg text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Detecting contract type...
              </motion.p>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "confirm": {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex flex-col space-y-4 mb-4">
                <p>
                  We have detected the following contract type:
                  <span className="bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-2xl text-transparent">
                    {" "}
                    {detectedType}
                  </span>
                </p>
                <p>Would you like to analyze this contract with our AI?</p>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleAnalyzeContract}
                  className="relative bg-gradient-to-r from-purple-600 hover:from-purple-700 to-indigo-600 hover:to-indigo-700 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.8)] px-6 py-3 rounded-full font-bold text-white transform transition-all duration-300 overflow-hidden ease-in-out hover:scale-105 group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="group-hover:from-gray-200 group-hover:to-white relative z-10 bg-clip-text bg-gradient-to-r from-white to-gray-200 text-transparent transition-all duration-300">
                    Yes, I want to analyze it
                  </span>
                  <span className="absolute inset-0 border-2 border-purple-400 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50 group-hover:opacity-75 blur-md transition-opacity duration-300"></span>
                </Button>
                <Button
                  onClick={() => setStep("upload")}
                  variant={"outline"}
                  className="flex-1 border-2 border-purple-600 hover:bg-purple-600 bg-gradient-to-r from-purple-600 hover:from-purple-700 to-indigo-600 hover:to-indigo-700 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.8)] px-4 py-2 rounded-full font-bold text-purple-600 hover:text-white transform transition-all duration-300 ease-in-out hover:scale-105 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="group-hover:from-white group-hover:to-gray-200 relative z-10 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300">
                    No, Try another file
                  </span>
                  <span className="absolute inset-0 border-2 border-purple-400 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50 group-hover:opacity-75 blur-md transition-opacity duration-300"></span>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "processing": {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col justify-center items-center py-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="text-primary size-20" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mt-6 font-semibold text-gray-700 text-lg text-transparent"
              >
                AI is analyzing your contract...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mt-2 text-sm text-transparent"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                >
                  This
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.3 }}
                >
                  may
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1, duration: 0.3 }}
                >
                  take
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4, duration: 0.3 }}
                >
                  some
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.7, duration: 0.3 }}
                >
                  time.
                </motion.span>
              </motion.p>
              <motion.div
                className="bg-gray-200 mt-6 rounded-full w-64 h-2 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
              >
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      }
      case "done": {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
             
            >
              <Alert className="border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg hover:shadow-xl mt-4 border-l-4 rounded-2xl transition-all duration-300">
                <AlertTitle className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-extrabold text-2xl text-transparent">Analysis completed</AlertTitle>
                <AlertDescription className="mt-2 font-medium text-green-700 text-lg">
                  Your contract has been analyzed. You can now view the results.
                </AlertDescription>
              </Alert>

              <motion.div className="relative flex flex-col space-y-4 mt-8">
                <Button
                  onClick={() => router.push(`/dashboard/results`)}
                  className="bg-gradient-to-r from-purple-600 hover:from-purple-700 via-pink-600 hover:via-pink-700 to-indigo-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full focus:ring-4 focus:ring-purple-300 font-extrabold text-lg text-white transform transition-all duration-500 ease-in-out hover:scale-110 focus:outline-none active:scale-95"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full w-full h-full transition-opacity duration-300"></span>
                  <span className="relative z-10 flex justify-center items-center">
                    <Sparkles className="mr-2 w-6 h-6 animate-pulse" />
                    <span className="bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-100 text-transparent">
                      View results
                    </span>
                  </span>
                </Button>
                <Button
                  variant={"outline"}
                  onClick={handleClose}
                  className="relative border-2 border-purple-600 bg-transparent hover:bg-purple-600 px-8 py-4 hover:border-transparent rounded-full focus:ring-4 focus:ring-purple-300 font-bold text-lg text-purple-600 hover:text-white transform transition-all duration-500 overflow-hidden ease-in-out group hover:scale-110 focus:outline-none active:scale-95"
                >
                  <span className="relative z-10 flex justify-center items-center">
                    <FileText className="mr-2 w-6 h-6" />
                    Close
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-0 group-hover:opacity-75 transition-opacity duration-500 ease-in-out"></div>
                  <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-20 transition-opacity animate-pulse duration-500 ease-in-out"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 group-hover:opacity-100 blur rounded-full transition animate-tilt duration-1000 group-hover:duration-200"></div>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-2xl p-8 rounded-3xl w-full max-w-2xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}