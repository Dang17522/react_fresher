import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/Book.tsx';
import AboutPage from 'pages/client/About.tsx';
import Login from '@/pages/client/auth/Login';
import Register from '@/pages/client/auth/Register';
import 'styles/global.scss'
import HomePage from './pages/client/Home';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },

    ],
  },
  {
    path: "/login",
    element: <Login/> 
  },
  {
    path: "/register",
    element: <Register/>
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <Layout /> */}
  </StrictMode>,
)
