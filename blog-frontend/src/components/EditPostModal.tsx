import { useState } from "react";
import { updatePost } from "../api/api";
import "./EditPostModal.css";

type Props = {
  post: any;
  onClose: () => void;
  onUpdated: (post: any) => void;
};

export default function EditPostModal({ post, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated = await updatePost(post.id, title, content);

    onUpdated(updated);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Edit Post</h2>

        <form onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
