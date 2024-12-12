import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { Button, Divider, Form, FormProps, Input, Modal, notification } from "antd";
import icon from "assets/images/Mobile login-bro.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type FieldType = {
  username?: string;
  password?: string;
};
const Login = () => {
  const modal2Open = true;
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  type NotificationType = 'success' | 'info' | 'warning' | 'error';
const {setIsAuthenticated,setUser} = useCurrentApp();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    console.log("->>: ",values);
    const res = await loginAPI(values.username ?? '', values.password ?? '');
    console.log("->>: ",res.data);
    if(res.data && res.data.status && res.data.status === 200){
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refeshToken', res.data.refeshToken);
      setIsAuthenticated(true);
      setUser(res.data.user);
      // openNotificationWithIcon('success', res.data?.message);
      navigate('/');
    }else{
      // message.error(res.data?.message);
      openNotificationWithIcon('error', res.data?.message);
    }
    setLoading(false);
  }

  const openNotificationWithIcon = (type: NotificationType,  message: string | undefined) => {
    console.log("message", message);
    
    api[type]({
      message: `Error`,
      description: message,
      showProgress: true,
      duration: 2

    });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
    {contextHolder}
      <Modal
        title={
          <div style={{display: 'flex',alignItems: 'center',gap: '10px'}}>
            <img src={icon} alt="Success Icon" style={{width: '60px',height: 'auto' }}/>
            <span>Login</span>
          </div>
        }
        centered
        open={modal2Open}
        footer=""
        closeIcon={false}>
        <Form
          layout="vertical"
          labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ margin: "auto" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên !!!' }]}>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu !!!' },

            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
          <Divider style={{ borderColor: '#7cb305', width: '200px' }} ><p>Hoặc</p></Divider>
          <Divider orientation="center" orientationMargin="0">
            Bạn chưa có tài khoản ? <Link to="/register">Đăng ký</Link>
          </Divider>
        </Form>
      </Modal>
    </>
  )
}
export default Login