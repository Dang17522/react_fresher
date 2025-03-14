import { useCurrentApp } from '@/components/context/app.context';
import { logoutAPI } from '@/services/api';
import { HappyProvider } from '@ant-design/happy-work-theme';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Col, Menu, Row } from 'antd';
import { useEffect, useState } from 'react';
import { FiPieChart } from 'react-icons/fi';
import { IoCreateOutline, IoHomeOutline } from 'react-icons/io5';
import { MdManageAccounts } from 'react-icons/md';
import { PiShippingContainer } from 'react-icons/pi';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { RxDashboard } from 'react-icons/rx';
import { SiNginxproxymanager } from 'react-icons/si';
import { Outlet, useNavigate } from 'react-router-dom';
type MenuItem = Required<MenuProps>['items'][number];

// const navigate = useNavigate();


const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [colMenu, setColMenu] = useState<number>(5);
  const [colContent, setColContent] = useState<number>(19);
  const navigate = useNavigate();
  const {setIsAuthenticated, setUser } = useCurrentApp();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);

  };

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

  const handleGoHome =  () => {
     navigate('/');
  }
  useEffect(() => {
    if (collapsed) {
      setColMenu(2);
      setColContent(22);
    } else {
      setColMenu(5);
      setColContent(19);
    }
  }, [collapsed])

  const items: MenuItem[] = [
    { key: '1', icon: <RxDashboard />, label: 'Dashboard' },
    {
      key: 'sub1',
      label: 'Manage User',
      icon: <MdManageAccounts />,
      children: [
        { key: '2', label: 'CRUD User', onClick: () => navigate('/admin/user'), icon: <IoCreateOutline /> },
      ],
    },
    {
      key: 'sub2',
      label: 'Manage Product',
      icon: <SiNginxproxymanager />,
      children: [
        { key: '3', label: 'CRUD Product', onClick: () => navigate('/admin/product'), icon: <IoCreateOutline /> },
      ],
    },
    {
      key: 'sub3',
      label: 'Manage Order',
      icon: <PiShippingContainer />,
      children: [
        { key: '8', label: 'CRUD Order' },
        // { key: '9', label: 'Option 12' },
      ],
    },
    { key: '10', icon: <FiPieChart />, label: 'Statistical' },
    {
      key: '11', icon: <IoHomeOutline />, label: <div>
        <p onClick={() => handleGoHome()}>Home</p>
      </div>
    },
    {
      key: '12', icon: <RiLogoutCircleLine />, label: <div>
        <p onClick={() => handleLogout()}>Logout</p>
      </div>
    },
  ];
  return (
    <div>
      <Row>
        <Col span={colMenu} >

          <HappyProvider>
            <Button type="dashed" onClick={toggleCollapsed} style={{ margin: '5px 15px', backgroundColor: '#FAFAD2' }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </HappyProvider>

          <Menu
            defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            items={items}
          />

        </Col>
        <Col span={colContent}>
          <Outlet />
        </Col>
      </Row>
    </div>
  )
}

export default AdminPage