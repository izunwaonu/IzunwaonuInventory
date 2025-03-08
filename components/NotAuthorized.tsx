// components/NotAuthorized.tsx
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl text-red-600 font-bold tracking-tight mb-2">
          Not Authorized
        </h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
