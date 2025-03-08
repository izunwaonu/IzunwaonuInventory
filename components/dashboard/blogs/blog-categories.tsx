"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/generateSlug";
import { createBlogCategory } from "@/actions/blogs";
import { BlogCategory } from "@prisma/client";

export default function BlogCategoryList({
  fetchedCategories,
}: {
  fetchedCategories: BlogCategory[];
}) {
  const defaultCategories = fetchedCategories.map((item) => item.name);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = async () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
    const data = {
      name: newCategory,
      slug: generateSlug(newCategory),
    };
    try {
      await createBlogCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Blog Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCategory()}
          />
          <Button onClick={addCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
