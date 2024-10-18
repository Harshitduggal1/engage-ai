import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserContracts() {
  const { data: contracts } = useQuery<ContractAnalysis[]>({
    queryKey: ["user-contracts"],
    queryFn: () => fetchUserContracts(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const contractTypeColors: { [key: string]: string } = {
    Employment: "bg-white text-blue-600 border-2 border-blue-400 hover:bg-blue-50 hover:border-blue-500 shadow-md hover:shadow-blue-200 transition-all duration-300",
    "Non-Disclosure Agreement": "bg-white text-green-600 border-2 border-green-400 hover:bg-green-50 hover:border-green-500 shadow-md hover:shadow-green-200 transition-all duration-300",
    Sales: "bg-white text-yellow-600 border-2 border-yellow-400 hover:bg-yellow-50 hover:border-yellow-500 shadow-md hover:shadow-yellow-200 transition-all duration-300",
    Lease: "bg-white text-emerald-600 border-2 border-emerald-400 hover:bg-emerald-50 hover:border-emerald-500 shadow-md hover:shadow-emerald-200 transition-all duration-300",
    Services: "bg-white text-pink-600 border-2 border-pink-400 hover:bg-pink-50 hover:border-pink-500 shadow-md hover:shadow-pink-200 transition-all duration-300",
    Other: "bg-white text-gray-600 border-2 border-gray-400 hover:bg-gray-50 hover:border-gray-500 shadow-md hover:shadow-gray-200 transition-all duration-300",
  };

  const columns: ColumnDef<ContractAnalysis>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => {
        return <Button variant="ghost" className="bg-clip-text bg-gradient-to-r from-purple-400 hover:from-pink-500 to-pink-600 hover:to-purple-600 font-extrabold text-transparent transition-all duration-300">Contract ID</Button>;
      },
      cell: ({ row }) => (
        <div className="bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-medium text-transparent">{row.getValue<string>("_id")}</div>
      ),
    },
    {
      accessorKey: "overallScore",
      header: ({ column }) => {
        return <Button variant="ghost" className="bg-clip-text bg-gradient-to-r from-green-400 hover:from-blue-500 to-blue-600 hover:to-green-600 font-extrabold text-transparent transition-all duration-300">Overall Score</Button>;
      },
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("overallScore"));
        return (
          <Badge
            className="shadow-lg px-4 py-2 rounded-full font-semibold text-white transform hover:scale-105 transition-all duration-300"
            style={{
              background: `linear-gradient(to right, ${
                score > 75 ? '#10B981, #059669' : score < 50 ? '#EF4444, #DC2626' : '#6366F1, #4F46E5'
              })`,
            }}
          >
            {score.toFixed(2)} Overall Score
          </Badge>
        );
      },
    },
    {
      accessorKey: "contractType",
      header: ({ column }) => {
        return <Button variant="ghost" className="bg-clip-text bg-gradient-to-r from-yellow-400 hover:from-orange-500 to-orange-600 hover:to-yellow-600 font-extrabold text-transparent transition-all duration-300">Contract Type</Button>;
      },
      cell: ({ row }) => {
        const contractType = row.getValue("contractType") as string;
        const colorClass = contractTypeColors[contractType] || contractTypeColors["Other"];
        return (
          <Badge className={`rounded-full px-4 py-2 font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 ${colorClass}`}>
            {contractType}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="bg-gradient-to-r from-purple-500 hover:from-indigo-500 to-indigo-500 hover:to-purple-500 shadow-lg p-2 rounded-full text-white transform hover:scale-110 transition-all duration-300">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-white/5 bg-white/5 shadow-2xl backdrop-blur-xl border rounded-xl">
              <DropdownMenuItem className="hover:bg-gradient-to-r from-blue-400 to-indigo-500 rounded-md text-slate-800 transition-all duration-300">
                <Link href={`/dashboard/contract/${contract._id}`} className="flex items-center space-x-2">
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-gradient-to-r from-rose-400 to-pink-500 rounded-md text-rose-400 hover:text-white transition-all duration-300">
                    <span>Delete Contract</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-white/5 bg-white/5 backdrop-blur-xl border rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 font-bold text-2xl text-transparent">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white/80">
                      This action cannot be undone. This will permanently delete
                      your contract and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white hover:bg-blue-400 text-green-600 transition-all duration-300">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-gradient-to-r from-rose-300 hover:from-pink-500 to-pink-600 hover:to-rose-400 text-white transition-all duration-300">Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contracts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const totalContracts = contracts?.length || 0;
  const averageScore =
    totalContracts > 0
      ? (contracts?.reduce(
          (sum, contract) => sum + (contract.overallScore ?? 0),
          0
        ) ?? 0) / totalContracts
      : 0;

  const highRiskContracts =
    contracts?.filter((contract) =>
      contract.risks.some((risk) => risk.severity === "high")
    ).length ?? 0;

  return (
    <div className="space-y-8 bg-transparent mx-auto p-6 min-h-screen container">
      <div className="flex justify-between items-center">
        <h1 className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold text-4xl text-transparent">Your Contracts</h1>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 hover:from-blue-700 via-purple-600 hover:via-purple-700 to-fuchsia-600 hover:to-fuchsia-700 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.8)] px-4 py-2 rounded-full font-bold text-white transform hover:scale-105 transition-all duration-300"
        >
          New Contract✨
        </Button>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        <Card className="border-white/10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl border rounded-xl transition-all duration-300">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-lg text-transparent">
              Total Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-black text-4xl text-white">{totalContracts}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-gradient-to-br from-blue-500/30 to-green-500/30 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-xl border rounded-xl transition-all duration-300">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-400 to-green-600 font-bold text-lg text-transparent">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-black text-4xl text-white">{averageScore.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-gradient-to-br from-red-500/30 to-yellow-500/30 shadow-2xl hover:shadow-red-500/20 backdrop-blur-xl border rounded-xl transition-all duration-300">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="bg-clip-text bg-gradient-to-r from-red-400 to-yellow-600 font-bold text-lg text-transparent">
              High Risk Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-black text-4xl text-white">{highRiskContracts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-white/10 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-300">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="bg-gradient-to-r from-purple-500 hover:from-pink-500 to-pink-500 hover:to-purple-500 border-none text-white transition-all duration-300"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-gradient-to-r from-blue-500 hover:from-indigo-500 to-indigo-500 hover:to-blue-500 border-none text-white transition-all duration-300"
        >
          Next
        </Button>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => table.reset()}
      />
    </div>
  );
}

async function fetchUserContracts(): Promise<ContractAnalysis[]> {
  const response = await api.get("/contracts/user-contracts");
  return response.data;
}