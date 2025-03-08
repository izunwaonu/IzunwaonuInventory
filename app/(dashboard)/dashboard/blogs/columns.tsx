"use client";
import DateColumn from "@/components/DataTableColumns/DateColumn";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Blog } from "@prisma/client";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import Link from "next/link";
import { ExternalLink, Eye, Mail } from "lucide-react";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { BriefBlog } from "@/actions/blogs";

export const columns: ColumnDef<BriefBlog>[] = [
  {
    accessorKey: "thumbnail",
    header: "Blog Thumbnail",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="thumbnail" />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableColumn column={column} title="Blog Title" />
    ),
  },

  {
    accessorKey: "categoryTitle",
    header: "Blog Category",
    cell: ({ row }) => {
      const blog = row.original;
      return <h2>{blog.categoryTitle}</h2>;
    },
  },

  {
    accessorKey: "view",
    header: "View Blog",
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <Link
          className="flex items-center justify-center space-x-2"
          target="_blank"
          href={`/blogs/${blog.id}`}
        >
          <Eye className="text-blue-500" />
        </Link>
      );
    },
  },

  // {
  //   accessorKey: "createdAt",
  //   header: "Published On",
  //   cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  // },

  {
    id: "actions",
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <ActionColumn
          row={row}
          model="blog"
          editEndpoint={`blogs/update/${blog.id}`}
          id={blog.id}
        />
      );
    },
  },
];
