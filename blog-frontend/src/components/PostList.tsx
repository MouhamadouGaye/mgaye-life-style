// import { useEffect, useState } from "react";
// import { getPosts } from "../api/api";
// import "./PostList.css";
// import { Link } from "react-router-dom";

// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   imageUrl: string;
// }

// export default function PostList() {
//   const [posts, setPosts] = useState<Post[]>([]);

//   useEffect(() => {
//     getPosts().then(setPosts);
//   }, []);

//   return (
//     <div className="container">
//       <h1 className="title">My Blog</h1>

//       <div className="posts-grid">
//         {posts &&
//           posts.map((post: any) => (
//             <Link to={`/posts/${post.id}`} className="post-card" key={post.id}>
//               <img src={post.imageUrl} />

//               <div className="post-content">
//                 <h3>{post.title}</h3>
//                 <p>{post.content.substring(0, 120)}...</p>
//               </div>
//             </Link>
//           ))}
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPosts, deletePost } from "../api/api";
import "./PostList.css";
import EditPostModal from "./EditPostModal";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const handleDelete = async (id: number) => {
    await deletePost(id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">My Blog</h1>

      <div className="posts-grid">
        {posts.map((post) => (
          <div className="post-card-wrapper" key={post.id}>
            <Link to={`/posts/${post.id}`} className="post-card">
              <img src={post.imageUrl} />

              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 120)}...</p>
              </div>
            </Link>

            {/* menu button */}
            <button
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenMenu(openMenu === post.id ? null : post.id);
              }}
            >
              ⋯
            </button>

            {openMenu === post.id && (
              <div className="menu">
                {/* <button>Edit</button> */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingPost(post);
                  }}
                  className="edit"
                >
                  Edit
                </button>

                <button className="quick-edit">Quick Edit</button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="delete"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdated={(updated) => {
            setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
          }}
        />
      )}
    </div>
  );
}
