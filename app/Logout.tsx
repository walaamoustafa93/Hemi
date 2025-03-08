"use client";
import { LogOut, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import Link from "next/link";

const clearSessionCookie = () => {
  document.cookie =
    "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=; secure;";
};
const logout = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      toast.error("Logout failed");
    }

    // Clear cookies
    clearSessionCookie();
    localStorage.clear();

    // Success toast
    toast.success("You have been logged out of your account.");

    window.location.href = "/login";
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Error: ${error.message}. Please try again.`);
    } else {
      toast.error("An unknown error occurred. Please try again.");
    }
  }
};

export default function AvatarWithLogout() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/assets/logo.webp" />
          <AvatarFallback>NeussHMI</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={'/Projects/editProfile'}>
        <DropdownMenuItem className="flex justify-between items-center text-blue-500">
          <span>Edit Profile</span>
          <Pencil  />
        </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="flex justify-between items-center text-red-500" onClick={logout}>
          Logout
          <LogOut className="ml-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
