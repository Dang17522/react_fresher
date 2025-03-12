
import Login from '@/pages/client/auth/Login';
import Register from '@/pages/client/auth/Register';
import { Button, ConfigProvider, Result } from 'antd';
import eng from 'antd/locale/en_US';
import ProtectedRoute from 'components/auth';
import { AppProvider } from 'components/context/app.context';
import AdminPage from 'pages/admin/AdminPage';
import AboutPage from 'pages/client/About.tsx';
import BookPage from '@/pages/client/ProductDetail';
import Checkout from 'pages/client/Checkout';
import HomePage from 'pages/client/Home';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'styles/global.scss';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import Layout from './layout';
import DashBoadrd from './pages/admin/dashBoadrd';
import ManageOrder from './pages/admin/manage.order';
import ManageUser from './pages/admin/manage.user';
import ManageProduct from './pages/admin/manage.product';
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
        path: "/product/:id",
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
        path: "/admin/product",
        element: <ManageProduct />,
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
