import { useState } from "react";
import { createPost } from "../api/api";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return;

    await createPost(title, content, image);

    alert("Post created");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button type="submit">Create Post</button>
    </form>
  );
}
