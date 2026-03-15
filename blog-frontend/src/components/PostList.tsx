import { useEffect, useState } from "react";
import { getPosts } from "../api/api";
import "./PostList.css";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="container">
      <h1 className="title">My Blog</h1>

      <div className="posts-grid">
        {/* {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <img src={post.imageUrl} alt={post.title} />

            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          </div>
        ))} */}

        {posts.map((post: any) => (
          <Link to={`/post/${post.id}`} className="post-card" key={post.id}>
            <img src={post.imageUrl} />

            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 120)}...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
