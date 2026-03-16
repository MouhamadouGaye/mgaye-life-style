const API_URL = import.meta.env.VITE_API_URL;

export const getPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  return res.json();
};

export const getPost = async (id: string | undefined) => {
  const res = await fetch(`${API_URL}/posts/${id}`);
  return res.json();
};

export const createPost = async (
  title: string,
  content: string,
  image: File,
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);
  formData.append("image", image);

  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};
