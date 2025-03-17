import { logoutAPI } from "@/services/api";
import { Avatar, Badge, Button, Col, Divider, Image, Input, Menu, MenuProps, Popover, Row, Typography } from "antd";
import { PopoverProps } from "antd/lib";
import banner from 'assets/images/banner.png';
import { useMemo, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { CiShoppingCart } from "react-icons/ci";
import { TfiHome, TfiSearch } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
const AppHeader = () => {
  const { user, isAuthenticated, setIsAuthenticated, setUser, coutCart, carts } = useCurrentApp();
  console.log("carts: ", carts);

  const isAdmin = user?.role === "Admin";
  const avatar = user?.avatar ?? "https://guides.uxtweak.com/wp-content/uploads/2023/05/UXT_User_feedback_01.png";
  type MenuItem = Required<MenuProps>['items'][number];
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  const { Text } = Typography;
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

  const text = <span>Danh sách sản phẩm</span>;
  const content = (
    <>
      {carts.map((item) => (
        <div>
          <Row>
            <Col span={6}>
              <Avatar size={45} icon={<img src={item.product.productMultiImage[0].image} alt="" />} />
            </Col>
            <Col span={18}>
              <p>
                <span>Tên SP: </span>
                <span style={{ fontWeight: 'bold', color: '#7cb305' }}><Text ellipsis={{ tooltip: item.product?.name }} style={{ maxWidth: 100 }}>
                  {item.product?.name}
                </Text></span>
              </p>
              <Row>
                <Col span={12}>
                  <p>Giá: {item.product.price}</p>
                </Col>
                <Col span={12}>
                  <p>Số Lượng: {item.value}</p>
                </Col>

              </Row>
            </Col>
            <Divider style={{ borderColor: '#7cb305', width: '200px' }} ></Divider>
          </Row>

        </div>
      ))}
      <Button type="primary" onClick={() => navigate('/checkout')} style={{ width: '100%' }}>Thanh toán</Button>
    </>
  );

  const [arrow, setArrow] = useState<'Show' | 'Hide' | 'Center'>('Show');

  const mergedArrow = useMemo<PopoverProps['arrow']>(() => {
    if (arrow === 'Hide') {
      return false;
    }

    if (arrow === 'Show') {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);
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
      label:
        <Popover placement="bottomLeft" title={text} content={content} arrow={mergedArrow}>
          <Link to="/checkout">
            <Badge count={coutCart}><span></span></Badge>
          </Link>
        </Popover>,


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
          <Avatar size={45} icon={<img src={avatar} alt="" />} />
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