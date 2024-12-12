import { update } from '@/services/api';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Select } from 'antd';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';
type FieldType = {
    id: number;
    username?: string;
    password?: string;
    enterPassword?: string;
    fullname?: string;
    email?: string;
    phone?: string;
    role?: string
};
const ModalUpdateUser = (props: any) => {
    const { modalUpdateOpen, setModalUpdateOpen, userUpdate, setUserUpdate } = props;

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const [id, setId] = useState<number>();
    const [password, setPassword] = useState<string | null>();
    const [enterPassword, setEnterPassword] = useState<string>();
    useEffect(() => {
        console.log("userUpdate: ", userUpdate);
        if (userUpdate) {
            setId(userUpdate.id)
            setPassword(null);
            form.setFieldsValue({
                username: userUpdate.username,
                email: userUpdate.email,
                role: userUpdate.role,
                password: null,
                fullname: userUpdate.fullname
            });
        }


    }, [userUpdate, form])


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        if (values.password != null && values.password !== values.enterPassword) {
            messageApi.open({
                type: 'error',
                content: 'Enter password not match',
            });
            setLoading(false);
            return;
        }
        console.log('Success:', values);
        const res = await update(id ?? 0,values.username ?? '', values.email ?? '',values.fullname??'',  values.password ?? '', values.role ?? 'User').then((res) => {
            if (res.data && res.data.status && res.data.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Đăng ký tài khoản thành cong',
                });

            } else {
                messageApi.open({
                    type: 'error',
                    content: res?.data?.message,
                });

            }
        })
        setLoading(false);
        setModalUpdateOpen(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            {contextHolder}
            <Modal width={500}
                title="Update User"
                centered

                open={modalUpdateOpen}
                footer={null}
                closeIcon={false}
            >

                <Form form={form}
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
                        <Input disabled />
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
                        label="FullName"
                        name="fullname"
                        rules={[{ required: true, message: 'Please enter fullname  !!!' }]}>
                        <Input />
                    </Form.Item>


                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        >
                        <Input.Password onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Item>

                        {password && (
                            <Form.Item<FieldType>
                            label="Enter Password"
                            name="enterPassword"
                            rules={[{ required: true, min: 6, message: 'Please enter password least 6 characters !!!' },

                            ]}>
                            <Input.Password />
                        </Form.Item>
                        )}
                        
                   

                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[{ required: true },

                        ]}>
                        <Select
                            suffixIcon={<SmileOutlined />}
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
                            Update <GrUpdate />
                        </Button>
                        <Button type="dashed" loading={loading} onClick={() => setModalUpdateOpen(false)} style={{ marginLeft: '10px' }}>
                            Cancel <FcCancel />
                        </Button>
                    </Form.Item>
                    <Divider style={{ borderColor: '#7cb305', width: '200px' }} ></Divider>

                </Form>

            </Modal>
        </div>
    )
}

export default ModalUpdateUser