"use server";

import { MetaPros } from "@/components/dashboard/blogs/blog-edit-form";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export type BlogCategoryProps = {
  name: string;
  slug: string;
};
export type BriefBlog = {
  id: string;
  title: string;
  thumbnail: string | null;
  published: boolean | null;
  categoryTitle: string;
};
export type BlogProps = {
  title: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  authorTitle: string;
  categoryTitle: string;
};
export async function createBlogCategory(data: BlogCategoryProps) {
  const slug = data.slug;

  if (slug) {
    try {
      const existingCategory = await db.blogCategory.findUnique({
        where: {
          slug,
        },
      });
      if (existingCategory) {
        return existingCategory;
      }
      const newCategory = await db.blogCategory.create({
        data,
      });

      revalidatePath("/dashboard/blogs");
      return newCategory;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function createNewBlog(data: BlogProps) {
  console.log(data);
  const slug = data.slug;
  try {
    const existingBlog = await db.blog.findUnique({
      where: {
        slug,
      },
    });
    if (existingBlog) {
      return existingBlog;
    }
    const newBlog = await db.blog.create({
      data,
    });
    console.log(newBlog);
    revalidatePath("/dashboard/blogs");
    return newBlog;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getBlogCategories() {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getBlogsByCategories() {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        blogs: true,
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getBlogs() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return blogs;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getDashboardBlogs() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        published: true,
        categoryTitle: true,
      },
    });

    return blogs;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getBlogById(id: string) {
  if (id) {
    try {
      const blog = await db.blog.findUnique({
        where: {
          id,
        },
      });

      return blog;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getBlogBySlug(slug: string) {
  if (slug) {
    try {
      const blog = await db.blog.findUnique({
        where: {
          slug,
        },
        include: {
          category: true,
          author: true,
        },
      });

      return blog;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getBlogCategoryBySlug(slug: string) {
  if (slug) {
    try {
      const cat = await db.blogCategory.findUnique({
        where: {
          slug,
        },
        include: {
          blogs: true,
        },
      });

      return cat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function deleteBlogById(id: string) {
  if (id) {
    try {
      const blog = await db.blog.delete({
        where: {
          id,
        },
      });
      revalidatePath("/dashboard/blogs");
      return {
        ok: true,
        data: blog,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export async function updateBlogById(id: string, data: BlogProps) {
  try {
    const updatedBlog = await db.blog.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedBlog;
  } catch (error) {
    console.log(error);
  }
}
export async function updateBlogContent(id: string, content: string) {
  try {
    const updatedBlog = await db.blog.update({
      where: {
        id,
      },
      data: {
        content,
        published: true,
      },
    });
    revalidatePath("/dashboard/blogs");
    return updatedBlog;
  } catch (error) {
    console.log(error);
  }
}
export async function updateMetaData(id: string, data: MetaPros) {
  try {
    const updatedBlog = await db.blog.update({
      where: {
        id,
      },
      data: {
        thumbnail: data.thumbnail,
        description: data.description,
        title: data.title,
      },
    });
    revalidatePath("/dashboard/blogs");
    return updatedBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function getRelatedBlogs(blogId: string) {
  // Fetch the current blog to get its categoryId
  const currentBlog = await db.blog.findUnique({
    where: { id: blogId },
    select: { categoryId: true },
  });

  if (!currentBlog) {
    throw new Error("Blog not found");
  }

  // Fetch blogs in the same category, excluding the current blog
  const relatedBlogs = await db.blog.findMany({
    where: {
      categoryId: currentBlog.categoryId,
      NOT: { id: blogId },
    },
    orderBy: { createdAt: "desc" }, // Optionally order by createdAt to show the most recent ones
    take: 3, // Optionally limit the number of related blogs returned
  });

  return relatedBlogs;
}
export async function getOtherCategories(catId: string) {
  const otherCategories = await db.blogCategory.findMany({
    where: {
      NOT: { id: catId },
    },
    orderBy: { createdAt: "desc" },
    include: {
      blogs: true,
    },
  });

  return otherCategories;
}
