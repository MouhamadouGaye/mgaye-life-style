import { useState } from "react";
import { createPost } from "../api/api";
import "./PostForm.css";

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
    <form onSubmit={handleSubmit} className="form">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-area"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="form-input"
      />

      <button className="form-button" type="submit">
        Create Post
      </button>
    </form>
  );
}
