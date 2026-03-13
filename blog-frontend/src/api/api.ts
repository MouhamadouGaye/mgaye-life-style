const API_URL = "https://blog-backend-429108478989.us-central1.run.app";

export const getPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
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
