import { useState } from "react";
import { createPost } from "../api/api";
import "./PostForm.css";

type Props = {
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostForm: React.FC<Props> = ({ setShown }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return;

    await createPost(title, content, image);

    alert("Post created");

    setShown(false); // ferme le formulaire

    // reset du form (bonne pratique)
    setTitle("");
    setContent("");
    setImage(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <button
          type="button"
          className="close-button"
          onClick={() => setShown(false)}
        >
          X
        </button>

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

        <button
          className="form-button"
          type="submit"
          onClick={() => setShown(false)}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};
export default PostForm;
