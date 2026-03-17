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

export const deletePost = async (id: number) => {
  await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
  });
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
  image: File | null,
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    body: formData,
  });

  return res.json();
};

export const patchPost = async (id: number, updates: any) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return res.json();
};
