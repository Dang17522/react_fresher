import { logoutAPI } from "@/services/api";
import { Badge, Image, Input, Menu, MenuProps } from "antd";
import banner from 'assets/images/banner.png';
import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { CiShoppingCart } from "react-icons/ci";
import { TfiHome, TfiSearch } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
const AppHeader = () => {
  const { user, isAuthenticated, setIsAuthenticated, setUser } = useCurrentApp();
  const isAdmin = user?.role === "Admin";
  const avatar = user?.avatar ?? "https://guides.uxtweak.com/wp-content/uploads/2023/05/UXT_User_feedback_01.png";
  type MenuItem = Required<MenuProps>['items'][number];
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refeshToken = localStorage.getItem('refeshToken') ?? '';
    const res = await logoutAPI(refeshToken);
    console.log(res);
    if (res?.status === 200) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refeshToken');
      navigate('/login');
    }

  }
  const items: MenuItem[] = [
    {
      label: <Link to="/">Trang Chủ</Link>,
      key: 'home',
      icon: <TfiHome />,
    },

    {
      label: <Link to="/about">Giới Thiệu</Link>,
      key: 'about',
      icon: <BiMessageSquareDetail />,
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
    }, {
      label: <div>
        <Input placeholder="input search text" onChange={(e) => setKey(e.target.value)} />
      </div>,
      key: 'search',
      icon: <TfiSearch onClick={() => console.log(key)} />,
    },
    ...(isAuthenticated ? [{
      label: <Link to="/checkout"><Badge count={3}><span></span></Badge></Link>,
      key: 'cart',
      icon: <CiShoppingCart style={{ fontSize: '20px' }} />,
    },] : []),


    {
      label: <div>
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <Image
            width={80}
            src={avatar}
          />
        </Image.PreviewGroup>
        {/* <img src={avatar} alt="" width={70} /> */}
      </div>, style: {
        marginLeft: 'auto',  // Đẩy item sang phải
        textAlign: 'right'

      },
      key: 'user',
      // icon: <GrUserAdmin />,
      children: [
        {
          type: 'group',
          label: 'Tài Khoản',
          children: [
            ...(isAdmin ? [
              { label: 'Trang Quản Trị', key: 'admin', onClick: () => { navigate('/admin') } },
              { label: 'Quản Lý Tài Khoản', key: 'manager', onClick: () => { navigate('/admin/user') } },
            ] : []),
            ...(isAuthenticated ? [
              { label: 'Lịch Sử', key: 'history' },
              { label: 'Đăng Xuất', key: 'logout', onClick: () => { handleLogout() } }] : [
              { label: 'Đăng Nhập', key: 'login', onClick: () => navigate('/login') },
            ])

          ],
        },
      ],
    },
  ];
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  return (
    <div>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ height: '50px' }} />
      <img src={banner} width={'100%'} height={'500px'} />
    </div>
  )
}

export default AppHeader