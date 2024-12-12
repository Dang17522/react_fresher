import { register } from '@/services/api';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Select } from 'antd';
import { FormProps } from 'antd/lib';
import { useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { GiNewShoot } from 'react-icons/gi';
type FieldType = {
    username?: string;
    password?: string;
    enterPassword?: string;
    email?: string;
    phone?: string;
    role?: string
};
const ModalAddUser = (props: any) => {
    const { modalOpen, setModalOpen } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
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
        const res = await register(values.username ?? '', values.email ?? '', values.password ?? '', values.role ?? 'User').then((res) => {
            if (res.data && res.data.status && res.data.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Đăng ký tài khoản thành cong',
                });

            } else {
                messageApi.open({
                    type: 'error',
                    content: res.data.message,
                });
            }
        })
        setLoading(false);
        setModalOpen(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            {contextHolder}
            <Modal width={500}
                title="Create New User"
                centered

                open={modalOpen}
                footer={null}
                closeIcon={false}
            >
                
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
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter username !!! !!!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter email !!!' },
                                { type: "email", message: "Not valid fomat email !" }
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
                                    message: "not valid format phone number !"
                                }, {
                                    min: 10,
                                    max: 10,
                                    message: "not valid format phone number (10 characters)"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, min: 6, message: 'Please enter password least 6 characters !!!' },

                            ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Enter Password"
                            name="enterPassword"
                            rules={[{ required: true, min: 6, message: 'Please enter password least 6 characters !!!' },

                            ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Role"
                            name="role"
                            rules={[{ required: true },

                            ]}>
                            <Select
                                suffixIcon={<SmileOutlined />}
                                defaultValue="Admin"
                                style={{ width: 120 }}
                                // onChange={handleChange}
                                options={[
                                    { value: 'Admin', label: 'Admin' },
                                    { value: 'User', label: 'User' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Create <GiNewShoot />
                            </Button>
                            <Button type="dashed"  loading={loading} onClick={() => setModalOpen(false)} style={{marginLeft: '10px'}}>
                                Cancel <FcCancel />
                            </Button>
                        </Form.Item>
                        <Divider style={{ borderColor: '#7cb305', width: '200px' }} ></Divider>

                    </Form>
               
            </Modal>
        </div>
    )
}

export default ModalAddUser