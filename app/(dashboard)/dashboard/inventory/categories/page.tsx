import React from "react";
import { columns } from "./columns";
import { Category } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { getAllCategories } from "@/actions/categories";

export default async function page() {
  const categories: Category[] = (await getAllCategories()) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Categories"
        linkTitle="Add Category"
        href="/dashboard/categories/new"
        data={categories}
        model="category"
      />
      <div className="py-8">
        <DataTable data={categories} columns={columns} />
      </div>
    </div>
  );
}
