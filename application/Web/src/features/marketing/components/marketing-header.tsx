"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { marketingNavLinks, siteMeta } from "../data/site";

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md md:px-6">
      {/* Logo + mobile menu */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="size-8 text-white hover:bg-white/10 md:hidden"
              variant="ghost"
              size="icon"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={12}
            className="w-44 border-white/10 bg-black/90 p-1 text-white backdrop-blur-md md:hidden"
          >
            <NavigationMenu className="max-w-none *:w-full">
              <NavigationMenuList className="flex-col items-start gap-0">
                {marketingNavLinks.map((link) => (
                  <NavigationMenuItem key={link.href} className="w-full">
                    <NavigationMenuLink asChild className="w-full py-1.5 hover:bg-white/10">
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-white md:text-base"
        >
          {siteMeta.name}
        </Link>
      </div>

      {/* Center nav (desktop) */}
      <NavigationMenu className="max-md:hidden">
        <NavigationMenuList className="gap-1">
          {marketingNavLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                asChild
                className="rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Link href={link.href}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right CTAs */}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild size="sm" className="bg-white text-black hover:bg-white/90">
          <Link href="/book-demo">Book Demo</Link>
        </Button>
      </div>
    </header>
  );
}
