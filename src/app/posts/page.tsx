import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function PostsPage() {
  const allPosts = await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    with: {
      author: true,
    },
  });

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/new">
          <Button>Create Post</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {allPosts.map((post) => (
          <article key={post.id} className="rounded-lg bg-card p-6 shadow">
            <h2 className="mb-2 text-2xl font-semibold">{post.title}</h2>
            <p className="mb-4 text-muted-foreground">{post.content}</p>
            <div className="text-sm text-muted-foreground">
              By {post.author.name || post.author.email} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
