import { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

function App() {
  const [shown, setShown] = useState<boolean>(false);
  return (
    <div>
      <h1>Blog</h1>

      <button onClick={() => setShown(!shown)}> Ajouter une publication</button>

      {shown && <PostForm setShown={setShown} shown={shown} />}

      <PostList />
    </div>
  );
}

export default App;
