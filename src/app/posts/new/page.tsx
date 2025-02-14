import { CreatePostForm } from "@/components/posts/create-post-form";

export default function NewPostPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Post</h1>
      <CreatePostForm />
    </div>
  );
}
