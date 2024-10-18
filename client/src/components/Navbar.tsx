"use client";

import { buttonVariants } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/constants"

import { LucideIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import MaxWidthWrapper from "./max-width-wrapper";
import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "./animation-container";
import { motion } from "framer-motion";

const Navbar = () => {
    const [scroll, setScroll] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 8) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={cn(
                "sticky top-0 inset-x-0 h-20 w-full border-b border-transparent z-[99999] select-none transition-all duration-300 ease-in-out shadow-lg",
                "bg-transparent"
            )}
        >
            <AnimationContainer reverse delay={0.1} className="size-full">
                <MaxWidthWrapper className="flex justify-between items-center h-full px-6">
                    <div className="flex items-center space-x-16">
                        <Link href="/#home" className="group">
                            <motion.span 
                                whileHover={{ scale: 1.1 }}
                                className="relative bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-pink-600 font-extrabold text-4xl text-transparent transition-transform duration-300"
                            >
                                Engage.ai
                                <span className="group-hover:scale-x-100 bottom-0 left-0 absolute bg-gradient-to-r from-blue-600 via-sky-500 to-pink-600 w-full h-0.5 transform origin-left transition-transform duration-300 scale-x-0"></span>
                            </motion.span>
                        </Link>

                        <NavigationMenu className="lg:flex hidden">
                            <NavigationMenuList className="space-x-2">
                                {NAV_LINKS.map((link) => (
                                    <NavigationMenuItem key={link.title}>
                                        {link.menu ? (
                                            <>
                                                <NavigationMenuTrigger className="hover:bg-gray-200 px-5 py-3 rounded-lg font-semibold text-gray-800 text-base hover:text-gray-900 transition-colors duration-200 ease-in-out shadow-md">
                                                    {link.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className={cn(
                                                        "grid gap-4 p-8 md:w-[400px] lg:w-[500px] rounded-2xl bg-white shadow-2xl",
                                                        link.title === "Features" ? "lg:grid-cols-[.75fr_1fr]" : "lg:grid-cols-2"
                                                    )}>
                                                        {link.title === "Features" && (
                                                            <li className="relative row-span-4 pr-2 rounded-lg overflow-hidden group">
                                                                <div className="bg-[linear-gradient(to_right,rgb(38,38,38,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(38,38,38,0.1)_1px,transparent_1px)] !z-10 absolute inset-0 bg-[size:1rem_1rem] group-hover:opacity-50 w-[calc(100%-10px)] h-full transition-opacity duration-300"></div>
                                                                <NavigationMenuLink asChild className="relative z-20">
                                                                    <Link
                                                                        href="/"
                                                                        className="flex flex-col justify-end bg-gradient-to-b from-gray-50 to-white focus:shadow-lg group-hover:shadow-xl p-8 rounded-lg w-full h-full no-underline transition-all duration-200 select-none outline-none"
                                                                    >
                                                                        <h6 className="group-hover:text-blue-600 mt-4 mb-2 font-semibold text-gray-900 text-xl transition-colors duration-200">
                                                                            All Features
                                                                        </h6>
                                                                        <p className="group-hover:text-gray-900 text-gray-600 text-sm leading-relaxed transition-colors duration-200">
                                                                            Manage links, track performance, and more.
                                                                        </p>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        )}
                                                        {link.menu.map((menuItem) => (
                                                            <ListItem
                                                                key={menuItem.title}
                                                                title={menuItem.title}
                                                                href={menuItem.href}
                                                                icon={menuItem.icon}
                                                            >
                                                                {menuItem.tagline}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link href={link.href} legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "px-5 py-3 text-base font-semibold text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 ease-in-out shadow-md")}>
                                                    {link.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <MobileNavbar />

                </MaxWidthWrapper>
            </AnimationContainer>
        </motion.header>
    )
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href!}
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-600 focus:bg-gray-100 focus:text-blue-600 group",
                        className
                    )}
                    {...props}
                >
                    <div className="group-hover:text-blue-600 flex items-center space-x-3 text-gray-700 transition-colors duration-200">
                        <Icon className="w-6 h-6" />
                        <h6 className="group-hover:text-blue-600 font-medium text-base !leading-none transition-colors duration-200">
                            {title}
                        </h6>
                    </div>
                    <p title={children! as string} className="group-hover:text-gray-700 line-clamp-2 text-gray-500 text-sm leading-snug transition-colors duration-200">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

export default Navbar
