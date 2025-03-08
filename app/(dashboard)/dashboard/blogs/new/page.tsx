import { getBlogCategories } from "@/actions/blogs";
// import BlogForm from "@/components/Forms/BlogForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page() {
  const categories = (await getBlogCategories()) || [];
  const blogCategories = categories.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? "";
  return (
    <div>
      <h2>Blog Form</h2>
      {/* <BlogForm userId={userId} blogCategories={blogCategories} /> */}
    </div>
  );
}
