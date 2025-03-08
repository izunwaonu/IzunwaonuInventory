"use client";

import React from "react";
export default function SimpleFallback() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}
