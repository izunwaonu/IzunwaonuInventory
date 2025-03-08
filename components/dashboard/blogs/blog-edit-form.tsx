"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import VEditor from "./editor";
import { Button } from "@/components/ui/button";
import ImageInput from "@/components/FormInputs/ImageInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TextInput from "@/components/FormInputs/TextInput";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Blog } from "@prisma/client";
import { generateSlug } from "@/lib/generateSlug";
import toast from "react-hot-toast";
import TextArea from "@/components/FormInputs/TextAreaInput";
import { updateBlogContent, updateMetaData } from "@/actions/blogs";
import { Loader2 } from "lucide-react";
export type MetaPros = {
  description: string;
  title: string;
  thumbnail: string;
};
export default function BlogEditForm({
  initialData,
  editingId,
}: {
  initialData: Blog | null | undefined;
  editingId: string;
}) {
  const initialContent =
    initialData?.content ?? "<p>Write your article here</p>";
  const [content, setContent] = useState(initialContent);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetaPros>({
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description || "",
    },
  });
  const initialImage = initialData?.thumbnail ?? "/placeholder.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function updateMeta(data: MetaPros) {
    setLoading(true);
    try {
      data.thumbnail = imageUrl;
      await updateMetaData(editingId, data);
      setLoading(false);
      toast.success("Updated Successfully!");
      reset();
      setImageUrl("/placeholder.png");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function handleUpdateContent() {
    setLoading(true);
    try {
      await updateBlogContent(editingId, content);
      setLoading(false);
      toast.success("Updated successfully");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="p-8">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
        Write your Blog Article
      </h2>
      <Tabs defaultValue="content" className="space-y-8">
        <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
          {["content", "meta", "more"].map((feature) => {
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
        <TabsContent value="content" className="space-y-8">
          <VEditor
            variant="default"
            content={content}
            setContent={setContent}
            isEditable={true}
          />
          <div className="">
            {loading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={handleUpdateContent}>
                Save and Publish Blog
              </Button>
            )}
          </div>
        </TabsContent>
        <TabsContent value="meta" className="space-y-8">
          <form className="" onSubmit={handleSubmit(updateMeta)}>
            <div className="grid grid-cols-12 gap-6 py-8">
              <div className="lg:col-span-8 col-span-full space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Meta Data</CardTitle>
                    <CardDescription>
                      This data will be used for SEO meta data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <TextInput
                          register={register}
                          errors={errors}
                          label="Blog Title"
                          name="title"
                        />
                      </div>
                      <div className="grid gap-3">
                        <TextArea
                          register={register}
                          errors={errors}
                          label="Blog Meta Description"
                          name="description"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-4 col-span-full ">
                <div className="grid auto-rows-max items-start gap-4 ">
                  <ImageInput
                    title="Blog thumbnail"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    endpoint="blogImage"
                  />
                </div>
              </div>
            </div>
            <div className="">
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Updating please wait...
                </Button>
              ) : (
                <Button type="submit">Update Post</Button>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="more" className="space-y-8">
          <h2>Categories</h2>
        </TabsContent>
      </Tabs>
    </div>
  );
}
