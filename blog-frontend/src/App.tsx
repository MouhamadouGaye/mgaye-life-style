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
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Divide } from "lucide-react";
import MainLayout from "./MainLayout";
import CamApp from "./CamApp";
import CanvasExample from "./test/Test";
import CanvasAnimation from "./test/CanvasAnimation";
import ParticleNetwork from "./test/ParticleNetwork";
import DroneText from "./test/DroneText";

function App() {
  const [shown, setShown] = useState<boolean>(false);
  return (
    <BrowserRouter>
      {/* <h1>Blog</h1>

      <button onClick={() => setShown(!shown)}> Ajouter une publication</button>

      {shown && <PostForm setShown={setShown} />} */}

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/index.html" element={<PostList />}></Route>
          <Route path="/posts/:id" element={<PostPage />}></Route>
          <Route path="/test" element={<CanvasExample />}></Route>
          <Route path="/particle" element={<ParticleNetwork />}></Route>
          <Route path="/drone" element={<DroneText />}></Route>

          <Route path="animation" element={<CanvasAnimation />}>
            {" "}
          </Route>

          <Route path="/" element={<Home />}></Route>
          <Route path="/photo" element={<CamApp />}></Route>

          <Route path="/:slug" element={<Demarches />} />

          <Route path="/:region/demarches" element={<AdminPage />} />

          <Route
            path="/:region/demarches/:expleDemandeDeCni"
            element={<Cni />}
          ></Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
