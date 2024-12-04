import { Badge, Menu, MenuProps } from "antd";
import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { GrUserAdmin } from "react-icons/gr";
import { TfiHome } from "react-icons/tfi";
import { useCurrentApp } from "../context/app.context";
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
const AppHeader = () => {
  const { user, isAuthenticated } = useCurrentApp();
  const isAdmin = user?.role === "Admin";
  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      label: <Link to="/">Trang Chủ</Link>,
      key: 'home',
      icon: <TfiHome />,
    },

    {
      label: <Link to="/about">Giới Thiệu</Link>,
      key: 'about',
      icon: <FcAbout />,
    },

    {
      label: 'Sản Phẩm',
      key: 'product',
      icon: <AiOutlineProduct />,
      children: [
        {
          type: 'group',
          label: 'Item 1',
          children: [
            { label: 'Option 1', key: 'setting:1' },
            { label: 'Option 2', key: 'setting:2' },
          ],
        },
        {
          type: 'group',
          label: 'Item 2',
          children: [
            { label: 'Option 3', key: 'setting:3' },
            { label: 'Option 4', key: 'setting:4' },
          ],
        },
      ],
    },
    ...(isAuthenticated ? [{
      label: <Link to="/checkout"><Badge count={3}><span></span></Badge></Link>,
      key: 'cart',
      icon: <CiShoppingCart style={{ fontSize: '20px' }} />,
    },] : []),

    {
      label: user?.username,
      key: 'user',
      icon: <GrUserAdmin />,
      children: [
        {
          type: 'group',
          label: 'Tài Khoản',
          children: [
            ...(isAdmin ? [
              { label: 'Trang Quản Trị', key: 'admin' },
              { label: 'Quản Lý Tài Khoản', key: 'manager' },
            ] : []),
            ...(isAuthenticated ? [
              { label: 'Lịch Sử', key: 'history' },
              { label: 'Đăng Xuất', key: 'logout' },] : [
              { label: 'Đăng Nhập', key: 'login' },
            ])

          ],
        },
      ],
    },
  ];
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <div>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
  )
}

export default AppHeader