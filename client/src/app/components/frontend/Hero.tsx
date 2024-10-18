import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import { ThemeToggle } from "../dashboard/ThemeToggle";

import { Button } from "@/components/ui/button";
import HeroImage from "@/public/hero.png";

export function Hero() {
  return (
    <>
      <div className="relative flex md:flex-row flex-col md:justify-between md:items-center mx-auto py-5 w-full">
        <div className="flex flex-row justify-between lg:justify-start items-center text-sm">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} className="size-10" alt="Logo" />

            <h4 className="font-semibold text-3xl">
              Blog<span className="text-primary">Marshal</span>
            </h4>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="md:flex md:justify-end md:space-x-4 hidden">
          <ThemeToggle />
        
        </nav>
      </div>

      <section className="relative flex justify-center items-center">
        <div className="relative items-center py-12 lg:py-20 w-full">
          <div className="text-center">
            <span className="bg-primary/10 px-4 py-2 rounded-full font-medium text-primary text-sm tracking-tight">
              Ultimate Blogging SaaS for Startups
            </span>

            <h1 className="mt-8 font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none">
              Setup your Blog{" "}
              <span className="block text-primary">in Minutes!</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl font-light text-base text-muted-foreground lg:text-lg tracking-tighter">
              Setting up your blog is hard and time consuming. We make it easy
              for you to create a blog in minutes
            </p>
            <div className="flex justify-center items-center gap-x-5 mt-5 w-full">
             
            </div>
          </div>

          <div className="relative items-center mx-auto mt-12 py-12 w-full">
            <svg
              className="absolute blur-3xl -mt-24"
              fill="none"
              viewBox="0 0 400 400"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_10_20)">
                <g filter="url(#filter0_f_10_20)">
                  <path
                    d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                    fill="#03FFE0"
                  ></path>
                  <path
                    d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                    fill="#7C87F8"
                  ></path>
                  <path
                    d="M320 400H400V78.75L106.2 134.75L320 400Z"
                    fill="#4C65E4"
                  ></path>
                  <path
                    d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                    fill="#043AFF"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="720.666"
                  id="filter0_f_10_20"
                  width="720.666"
                  x="-160.333"
                  y="-160.333"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    result="effect1_foregroundBlur_10_20"
                    stdDeviation="80.1666"
                  ></feGaussianBlur>
                </filter>
              </defs>
            </svg>

            <Image
              src={HeroImage}
              alt="Hero image"
              priority
              className="relative shadow-2xl border rounded-lg lg:rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
