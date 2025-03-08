"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardWelcomeProps {
  username: string;
  avatarUrl?: string;
}

export function DashboardWelcome({
  username,
  avatarUrl,
}: DashboardWelcomeProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      {/* <CardHeader>
        <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="mt-4 flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {greeting}, {username}!
            </CardTitle>
            <CardDescription>Welcome back to your dashboard</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
