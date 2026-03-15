import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/api";
import "./PostPage.css";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    getPost(id).then(setPost);
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="article-container">
      <img className="article-image" src={post.imageUrl} />

      <h1 className="article-title">{post.title}</h1>

      <p className="article-content">{post.content}</p>
    </div>
  );
}
