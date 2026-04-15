import { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostPage from "./components/PostPage";
import Cni from "./components/demand/Cni";
import AdminPage from "./pages/AdminPage";
import Demarches from "./pages/demarches/Demarches";
import Home from "./pages/Home";
import NotFound from "./pages/notfound/NotFound";
import Header from "./components/header/Herder";
import Footer from "./components/footer/Footer";

function App() {
  const [shown, setShown] = useState<boolean>(false);
  return (
    <BrowserRouter>
      {/* <h1>Blog</h1>

      <button onClick={() => setShown(!shown)}> Ajouter une publication</button>

      {shown && <PostForm setShown={setShown} />} */}
      <Header />

      <Routes>
        <Route path="/index.html" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<PostPage />}></Route>

        <Route path="/" element={<Home />}></Route>
        <Route path="/:slug" element={<Demarches />} />

        <Route path="/:region/demarches" element={<AdminPage />} />
        <Route
          path="/:region/demarches/:expleDemandeDeCni"
          element={<Cni />}
        ></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
