import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getBlogCategories, getDashboardBlogs } from "@/actions/blogs";
import BlogCategoryList from "@/components/dashboard/blogs/blog-categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogCreateForm } from "@/components/dashboard/blogs/blog-form";
import { getAuthenticatedUser } from "@/config/useAuth";

export default async function page() {
  const blogs = (await getDashboardBlogs()) || [];
  const categories = (await getBlogCategories()) || [];
  const author = await getAuthenticatedUser();
  return (
    <div className="p-8">
      <Tabs defaultValue="blogs" className="space-y-8">
        <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
          {["blogs", "blog-categories"].map((feature) => {
            return (
              <TabsTrigger
                key={feature}
                value={feature}
                className="inline-flex items-center gap-2 border-b-2 border-transparent px-8 pb-3 pt-2 data-[state=active]:border-primary capitalize"
              >
                {feature.split("-").join(" ")}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value="blogs" className="space-y-8">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 py-3">
            <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
              Blogs({blogs.length})
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <BlogCreateForm
                author={author}
                categories={categories.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                })}
              />
            </div>
          </div>
          <div className="py-8">
            <DataTable data={blogs} columns={columns} />
          </div>
        </TabsContent>
        <TabsContent value="blog-categories" className="space-y-8">
          <div className="max-w-2xl py-6">
            <BlogCategoryList fetchedCategories={categories} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
