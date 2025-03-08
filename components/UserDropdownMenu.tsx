"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  username: string;
  email: string;
  avatarUrl?: string;
}

export function UserDropdownMenu({
  username,
  email,
  avatarUrl,
}: UserDropdownProps) {
  const router = useRouter();
  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpgrade = () => {
    // Add your upgrade logic here
    console.log("Upgrading to Pro...");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-full justify-start gap-2 px-4"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={handleUpgrade} className="cursor-pointer">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
