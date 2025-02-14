import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  "use server";

  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await db.insert(posts).values({
    title,
    content,
    authorId: user.id,
  });

  redirect("/posts");
}

export function CreatePostForm() {
  return (
    <form action={createPost} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter post title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <Textarea
          id="content"
          name="content"
          required
          placeholder="Write your post content"
          rows={6}
        />
      </div>

      <Button type="submit">Create Post</Button>
    </form>
  );
}
