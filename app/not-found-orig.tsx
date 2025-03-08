"use client";
import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const NotFound = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          opacity: "0.5",
        }}
      />

      {/* Decorative Elements - More visible now */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <Card className="relative w-full max-w-3xl mx-4 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="pt-16 px-4 md:px-8">
          <div className="space-y-6 text-center">
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Page Not Found
            </h2>
            <p className="max-w-md mx-auto text-gray-600">
              Oops! It seems you've ventured into uncharted territory. The page
              you're looking for has either moved or doesn't exist.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Return Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="border-blue-200 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center pb-16 pt-12">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NextAdmin. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default NotFound;
