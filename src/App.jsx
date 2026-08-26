import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import GlobalMouse from "./components/globalMouse/GlobalMouse";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";

// ScrollToTop component resets scroll to (0,0) on any route or search query change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
};

// Layout defined at module scope
const Layout = () => {
  return (
    <div className="app">
      <GlobalMouse />
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Router definition
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gigs", element: <Gigs /> },
      { path: "/myGigs", element: <MyGigs /> },
      { path: "/orders", element: <Orders /> },
      { path: "/messages", element: <Messages /> },
      { path: "/message/:id", element: <Message /> },
      { path: "/add", element: <Add /> },
      { path: "/gig/:id", element: <Gig /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
