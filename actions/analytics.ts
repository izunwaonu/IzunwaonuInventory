"use server";

import { db } from "@/prisma/db";
import {
  DollarSign,
  LayoutGrid,
  LucideProps,
  Users,
  Users2,
} from "lucide-react";
export type AnalyticsProps = {
  title: string;
  total: number;
  href: string;
  icon: any;
  isCurrency?: boolean;
};
export async function getDashboardOverview() {
  try {
    const savings = await db.saving.findMany();

    const usersLength = await db.user.count();
    const totalRevenue =
      savings && savings.length > 0
        ? savings.reduce((acc, item) => {
            return acc + (item.amount || 0);
          }, 0)
        : 0;
    const analytics = [
      {
        title: "Total Savings",
        total: totalRevenue,
        href: "/dashboard/savings",
        icon: DollarSign,
        isCurrency: true,
      },
      {
        title: "Users",
        total: usersLength,
        href: "/dashboard/users",
        icon: Users,
      },
    ];

    return analytics;
  } catch (error) {
    console.log(error);
    return null;
  }
}
