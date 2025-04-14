import Image from "next/image";
import React from "react";

export default function ImageColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: any;
}) {
  const rawUrl = row.getValue(`${accessorKey}`);
  
  const imageUrl =
    typeof rawUrl === "string" &&
    (rawUrl.startsWith("http") || rawUrl.startsWith("/"))
      ? rawUrl
      : rawUrl
      ? `/${rawUrl}`
      : "/placeholder.png";
  
  return (
    <div className="shrink-0">
      <Image
        alt={`${accessorKey}`}
        className="aspect-square rounded-full object-cover"
        height="50"
        src={imageUrl ?? "/placeholder.png"}
        width="50"
      />
    </div>
  );
}
