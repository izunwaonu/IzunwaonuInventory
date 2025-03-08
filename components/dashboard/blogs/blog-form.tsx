"use client";
import { createNewBlog } from "@/actions/blogs";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthenticatedUser } from "@/config/useAuth";
import { generateSlug } from "@/lib/generateSlug";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function BlogCreateForm({
  categories,
  author,
}: {
  categories: {
    label: string;
    value: string;
  }[];
  author: AuthenticatedUser | null;
}) {
  const [title, setTile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(categories[0]);
  const router = useRouter();
  const createBlog = async () => {
    setLoading(true);
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    const data = {
      title: title,
      slug: generateSlug(title),
      categoryId: selectedCategory.value,
      categoryTitle: selectedCategory.label,
      authorId: author?.id ?? "",
      authorName: author?.name ?? "",
      authorImage: author?.image ?? "",
      authorTitle: "",
    };
    console.log(data);
    try {
      const res = await createNewBlog(data);
      console.log(res);
      if (res && res.id) {
        setLoading(false);
        router.push(`/dashboard/blogs/update/${res.id}`);
        toast.success("Blog created successfully");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Blog
          </span>
          <span className="md:sr-only">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Create New Blog</CardTitle>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-col w-full gap-2">
              <Input
                type="text"
                placeholder="New Blog title"
                value={title}
                onChange={(e) => setTile(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createBlog()}
              />
              {err && <p className="text-red-500 -mt-1">{err}</p>}
              <FormSelectInput
                label="Blog Categories"
                options={categories}
                option={selectedCategory}
                setOption={setSelectedCategory}
              />
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait...
                </Button>
              ) : (
                <Button onClick={createBlog}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
