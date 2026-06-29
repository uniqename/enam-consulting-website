import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-content font-display selection:bg-brand selection:text-white w-full">
      
      <ScrollRestoration />

      <header className="sticky top-0 z-50 w-full">
        <Navbar />
      </header>

      <main className="grow relative flex flex-col w-full">
        <Outlet />
      </main>

      <footer className="mt-auto z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;