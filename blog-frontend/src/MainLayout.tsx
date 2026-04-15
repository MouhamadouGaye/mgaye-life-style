import { Outlet } from "react-router-dom";
import Header from "./components/header/Herder";
import Footer from "./components/footer/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
