import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "../components/dashboard/EmptyState";
import prisma from "../utils/db";
import Image from "next/image";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData() {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { sites, articles };
}

export default async function DashboardIndexPage() {
  const { articles, sites } = await getData();
  return (
    <div>
      <h1 className="mb-5 font-semibold text-2xl">Your Sites</h1>
      {sites.length > 0 ? (
        <div className="gap-4 lg:gap-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id}>
              <Image
                src={site.imageUrl ?? Defaultimage}
                alt={site.name}
                className="rounded-t-lg w-full h-[200px] object-cover"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{site.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {site.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/sites/${site.id}`}>
                    View Site
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any sites created"
          description="Create a site to get started"
          buttonText="Create Site"
          href="/sites/new"
        />
      )}

      <h1 className="mt-10 mb-5 font-semibold text-2xl">Recent Articles</h1>
      {articles.length > 0 ? (
        <div className="gap-4 lg:gap-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.image ?? Defaultimage}
                alt={item.title}
                className="rounded-t-lg w-full h-[200px] object-cover"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{item.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.smallDescription}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/sites/${item.siteId}/${item.id}`}>
                    Edit Article
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any articles created"
          description="Create an article to get started"
          buttonText="Create Article"
          href="/sites"
        />
      )}
    </div>
  );
}
