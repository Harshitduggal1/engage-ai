import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Icons } from "./icons";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/zustand";

export function UserButton() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { openModal } = useModalStore();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
    setInterval(() => router.push("/"), 1000);
  };

  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="size-10 rounded-full p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200"
            >
              <Avatar className="size-full">
                <AvatarImage src={user?.profilePicture || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-bold">
                  {user?.displayName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white rounded-lg border border-gray-200 shadow-xl" forceMount>
            <DropdownMenuItem className="flex flex-col items-start px-4 py-3">
              <div className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.displayName}</div>
              <div className="text-xs text-gray-600">{user?.email}</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem asChild className="px-4 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-200">
              <Link href={"/dashboard"} className="flex items-center">
                <Icons.dashboard className="mr-2 size-4 text-blue-600" />
                <span className="text-sm text-gray-800">Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-200">
              <Link href={"/dashboard/settings"} className="flex items-center">
                <Icons.settings className="mr-2 size-4 text-purple-600" />
                <span className="text-sm text-gray-800">Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="px-4 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-colors duration-200">
              <Icons.logout className="mr-2 size-4 text-red-600" />
              <span className="text-sm text-gray-800">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => openModal("connectAccountModal")}
          className="px-6 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 focus:ring-2 focus:ring-blue-400 focus:outline-none relative overflow-hidden group"
        >
          <span className="relative z-10">Sign in</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
        </Button>
      )}
    </div>
  );
}
