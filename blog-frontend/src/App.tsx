import { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostPage from "./components/PostPage";
import Cni from "./components/demand/Cni";
import AdminPage from "./pages/AdminPage";
import Demarches from "./pages/demarches/Demarches";

function App() {
  const [shown, setShown] = useState<boolean>(false);
  return (
    <BrowserRouter>
      {/* <h1>Blog</h1>

      <button onClick={() => setShown(!shown)}> Ajouter une publication</button>

      {shown && <PostForm setShown={setShown} />} */}

      <Routes>
        <Route path="/index.html" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<PostPage />}></Route>
        <Route path="/demarches" element={<AdminPage />}></Route>
        <Route path="/:slug" element={<Demarches />} />

        <Route path="/:region/demarches" element={<AdminPage />} />
        <Route
          path="/:region/demarches/:expleDemandeDeCni"
          element={<Cni />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
