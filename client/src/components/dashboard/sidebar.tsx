"use client";

import { cn } from "@/lib/utils";
import { FileText, Home, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

export const Sidebar = () => (
  <aside className="lg:block border-gray-200 hidden bg-white border-r w-[280px] min-h-screen">
    <SidebarContent />
  </aside>
);

const SidebarContent = () => {
  const pathname = usePathname();
  const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Results", href: "/dashboard/results" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: FileText, label: "AI", href: "/dashboard/ai" } // Corrected icon from string to component
  ];

  return (
    <div className="flex flex-col p-6 h-full">
      <nav className="flex-grow">
        <ul className="flex flex-col space-y-2">
          {sidebarItems.map((item) => (
            <Navlink key={item.label} path={pathname} link={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

const Navlink = ({
  path,
  link,
}: {
  path: string;
  link: {
    icon: ElementType;
    label: string;
    href: string;
    target?: string;
  };
}) => {
  const isActive = path === link.href;
  return (
    <li>
      <Link
        href={link.href}
        target={link.target}
        className={cn(
          "flex items-center gap-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
            : "text-gray-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
        )}
      >
        <link.icon className="w-5 h-5 shrink-0" />
        <span>{link.label}</span>
      </Link>
    </li>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex bg-gray-100 h-screen">
      <Sidebar />
      <div className="flex-1 bg-white shadow-lg p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
