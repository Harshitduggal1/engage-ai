import { RenderArticle } from "@/app/components/dashboard/RenderArticle";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

async function getData(name: string, slug: string) {
  // First, find the site by subdirectory (name)
  const site = await prisma.site.findUnique({
    where: {
      subdirectory: name,
    },
    select: {
      id: true,
    },
  });

  if (!site) {
    return notFound();
  }

  // Then, find the post by slug within the site
  const data = await prisma.post.findUnique({
    where: {
      siteId_slug: {
        siteId: site.id,
        slug: slug,
      },
    },
    select: {
      articleContent: true,
      title: true,
      smallDescription: true,
      image: true,
      createdAt: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function SlugRoute({
  params,
}: {
  params: { slug: string; name: string };
}) {
  console.log('SlugRoute params:', params); // Debugging log
  const data = await getData(params.name, params.slug);

  if (!data) {
    return <div>Post not found.</div>; // Fallback UI
  }

  return (
    <>
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/blog/${params.name}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-medium text-xl">Go Back</h1>
      </div>

      <div className="flex flex-col justify-center items-center mb-10">
        <div className="m-auto w-full md:w-7/12 text-center">
          <p className="m-auto my-5 w-10/12 font-light text-muted-foreground text-sm md:text-base">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(data.createdAt)}
          </p>
          <h1 className="mb-5 font-bold text-3xl md:text-6xl tracking-tight">
            {data.title}
          </h1>
          <p className="m-auto line-clamp-3 w-10/12 text-muted-foreground">
            {data.smallDescription}
          </p>
        </div>
      </div>

      <div className="relative m-auto mb-10 md:mb-20 md:rounded-2xl w-full md:w-5/6 lg:w-2/3 max-w-screen-lg h-80 md:h-[450px] overflow-hidden">
        <Image
          src={data.image}
          alt={data.title}
          width={1200}
          height={630}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <RenderArticle json={data.articleContent as JSONContent} />
    </>
  );
}