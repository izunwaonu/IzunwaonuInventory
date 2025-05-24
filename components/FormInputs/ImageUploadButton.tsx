
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type ImageInputProps = {
  title: string;
  imageUrl: string;
  setImageUrl: any;
  display: "horizontal" | "vertical"
  size: "sm" | "lg"
  endpoint: any;
};

export default function ImageUploadButton({
  title,
  imageUrl,
  setImageUrl,
  endpoint,
  display ="vertical",
  size ="sm"
}: ImageInputProps) {
  return (
    <div className={cn("flex  items-center gap-2", display==="horizontal"?"flex-row":"flex-col")}>
      <div className={cn("relative overflow-hidden rounded-md", size==="sm"?" h-10 w-10":" h-20 w-20")}>
        <Image
          alt={title}
          className="object-cover"
          src={imageUrl}
          fill
          sizes="96px"
        />
      </div>
      <UploadButton
        className="mt-1 w-full text-sm"
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          setImageUrl(res[0].url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}