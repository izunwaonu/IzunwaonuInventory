import React from "react";

export default function SectionHeading({ title }: { title: string }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
      {title}
    </h1>
  );
}
