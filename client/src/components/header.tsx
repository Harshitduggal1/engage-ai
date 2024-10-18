"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { UserButton } from "./shared/user-button";
import Navbar from "./Navbar";

const navItems: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Pricing", href: "/pricing" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Header() {
  const pathname = usePathname();

  return (


    <header className="top-0 z-50 sticky bg-background/95 shadow-lg hover:shadow-xl backdrop-blur px-4 border-b w-full transition-all duration-300">
    
      <div className="flex items-center h-16 container">
        <div className="md:flex hidden mr-4">
          <Link href={"/"} className="flex items-center space-x-2 mr-6 transition-transform duration-300 hover:scale-105">
            <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-2xl text-transparent">LOGO</span>
          </Link>

          <nav className="flex items-center space-x-7 font-medium text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-all duration-300 hover:text-foreground/80 hover:scale-105",
                  pathname === item.href
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400"
                    : "text-foreground/60 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <UserButton />
        <Navbar/>
      </div>
    </header>
  );
}
