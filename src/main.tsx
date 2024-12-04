import Layout from '@/layout';
import Login from '@/pages/client/auth/Login';
import Register from '@/pages/client/auth/Register';
import ProtectedRoute from 'components/auth';
import { AppProvider } from 'components/context/app.context';
import AdminPage from 'pages/admin/AdminPage';
import AboutPage from 'pages/client/About.tsx';
import BookPage from 'pages/client/Book.tsx';
import Checkout from 'pages/client/Checkout';
import HomePage from 'pages/client/Home';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'styles/global.scss';
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
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (<ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>),
      },

    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
    {/* <Layout /> */}
  </StrictMode>,
)
