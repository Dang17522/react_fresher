import { loginAPI, register } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Card, Divider, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
  type FieldType = {
    username?: string;
    password?: string;
    enterPassword?: string;
    email?: string;
    phone?: string;
  };
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    if (values.password !== values.enterPassword) {
      messageApi.open({
        type: 'error',
        content: 'Nhập lại mật khẩu không đúng',
      });
      setLoading(false);
      return;
    }
    console.log('Success:', values);
    const res = await register(values.username ?? '', values.email ?? '', values.password ?? '').then((res) => {
      if (res.data && res.data.status && res.data.status === 200) {
        messageApi.open({
          type: 'success',
          content: 'Đăng ký tài khoản thành cong',
        });
        navigate('/login');

      }else{
        messageApi.open({
          type: 'error',
          content: res.data.message ,
        });
      }
    })
    setLoading(false);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      {contextHolder}
      <Card title="Đăng Ký Tài Khoản" bordered={true} style={{ width: 500 }}>
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email !!!' },
              { type: "email", message: "Không đúng định dạng email !" }
            ]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                type: "regexp",
                pattern: new RegExp(/\d+/g),
                message: "Không đúng định dạng sđt !"
              }, {
                min: 10,
                max: 10,
                message: "Không đúng định dạng sđt (10 ký tự)"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, min: 6, message: 'Vui lòng nhập mật khẩu tối thiểu 6 ký tự !!!' },

            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Nhập lại mật khẩu"
            name="enterPassword"
            rules={[{ required: true, min: 6, message: 'Vui lòng nhập mật khẩu tối thiểu 6 ký tự !!!' },

            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>
          <Divider style={{ borderColor: '#7cb305', width: '200px' }} ><p>Hoặc</p></Divider>
          <Divider orientation="center" orientationMargin="0">
            Đã có tài khoản ? <Link to="/login">Đăng nhập</Link>
          </Divider>
        </Form>
      </Card>
    </div>
  )
}

export default Register