import { useEffect, useState } from "react";
import { getPosts } from "../api/api";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div>
      <h2>Posts</h2>

      {posts.map((post: any) => (
        <div key={post.id}>
          <h3>{post.title}</h3>

          <p>{post.content}</p>

          <img src={post.imageUrl} width="200" />
        </div>
      ))}
    </div>
  );
}
