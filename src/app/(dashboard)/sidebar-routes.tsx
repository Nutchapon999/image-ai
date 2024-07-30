"use client";

import { CreditCard, Crown, Home, MessageCircleQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

export const SidebarRoutes = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Button
          onClick={() => {}}
          className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
          variant="outline"
          size="lg"
        >
          <Crown className="size-4 mr-2 fill-yellow-500 text-yellow-500"/>
          Upgrade to Pro
        </Button>
      </div>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem 
          href="/"
          icon={Home}
          label="Home"
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem 
          href={pathname}
          icon={CreditCard}
          label="Billing"
          onClick={() => {}}
        />
        <SidebarItem 
          href="mailto:support@codewithantonio.com"
          icon={MessageCircleQuestion}
          label="Get Help"
        />
      </ul>
    </div>
  );
}