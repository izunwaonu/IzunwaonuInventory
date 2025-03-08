import { getNormalDate } from "@/lib/getNormalDate";
import React from "react";
const getPastDays = (isoString: string): number => {
  const createdDate = new Date(isoString);
  const currentDate = new Date();

  // Reset times to midnight for accurate day calculation
  createdDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const diffTime = currentDate.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
function timeAgo(createdAt: string): string {
  const createdDate = new Date(createdAt); // Convert the string to a Date object
  const now = new Date();
  const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export default function DateColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: any;
}) {
  const createdAt = row.getValue(`${accessorKey}`);
  const date = getNormalDate(createdAt);
  const originalDate = new Date(createdAt);

  const day = originalDate.getDate();
  const month = originalDate.toLocaleString("default", { month: "short" });
  const year = originalDate.getFullYear();
  const time = timeAgo(createdAt);
  const pastDays = getPastDays(createdAt);
  return <div className="hidden md:block">{date}</div>;
}
