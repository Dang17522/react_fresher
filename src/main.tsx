
import Login from '@/pages/client/auth/Login';
import Register from '@/pages/client/auth/Register';
import { Button, ConfigProvider, Result } from 'antd';
import eng from 'antd/locale/en_US';
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
import Layout from './layout';
import DashBoadrd from './pages/admin/dashBoadrd';
import ManageBook from './pages/admin/manage.book';
import ManageOrder from './pages/admin/manage.order';
import ManageUser from './pages/admin/manage.user';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>
      <Result
        status="404"
        title="404"
        subTitle="Trang không tồn tại."
        extra={<Button type="primary" onClick={() => window.location.href = '/'}>Trang Chủ</Button>}
      />
    </div>,

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
        path: "/admin/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
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
  {
    path: "/admin",
    element: (
      // <ProtectedRoute>
      <AdminPage />
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashBoadrd />,
      },
      {
        path: "/admin/user",
        element: <ManageUser />,
      },
      {
        path: "/admin/book",
        element: <ManageBook />,
      },
      {
        path: "/admin/order",
        element: <ManageOrder />,
      },

    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ConfigProvider locale={eng}>

        <RouterProvider router={router} />
      </ConfigProvider>

    </AppProvider>
    {/* <Layout /> */}
  </StrictMode>,
)
