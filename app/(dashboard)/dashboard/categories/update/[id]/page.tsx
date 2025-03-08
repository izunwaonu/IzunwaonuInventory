import { getCategoryById } from "@/actions/categories";
import CategoryForm from "@/components/Forms/CategoryForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const category = await getCategoryById(id);
  return (
    <div className="p-8">
      <CategoryForm initialData={category} editingId={id} />
    </div>
  );
}
