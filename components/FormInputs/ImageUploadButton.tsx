
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import React from "react";

type ImageInputProps = {
  title: string;
  imageUrl: string;
  setImageUrl: any;
  endpoint: any;
};

export default function ImageUploadButton({
  title,
  imageUrl,
  setImageUrl,
  endpoint,
}: ImageInputProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
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