import { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import PostPage from "./components/PostPage";

function App() {
  const [shown, setShown] = useState<boolean>(false);
  return (
    <BrowserRouter>
      <h1>Blog</h1>

      <button onClick={() => setShown(!shown)}> Ajouter une publication</button>

      {shown && <PostForm setShown={setShown} />}

      <Routes>
        <Route path="/" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<PostPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
