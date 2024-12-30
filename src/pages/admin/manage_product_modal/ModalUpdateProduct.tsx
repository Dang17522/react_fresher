import { getListCategory, updateProduct } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Select, Upload } from 'antd';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';
type FieldType = {
    id: number,
    name: string,
    status: number,
    image: any,
    quantity: number,
    vote: number,
    createAt: Date,
    category: any,
    price: number
};
const ModalUpdateProduct = (props: any) => {
    const { modalUpdateOpen, setModalUpdateOpen, productUpdate } = props;
    const [category, setCategory] = useState<ICategory[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const [id, setId] = useState<number>();
    useEffect(() => {
        if (productUpdate) {
            setId(productUpdate.id)
            form.setFieldsValue({
                name: productUpdate.name,
                status: productUpdate.status == 1 ? 'Active' : 'Inactive',
                image: productUpdate.image,
                quantity: productUpdate.quantity,
                category: productUpdate.category,
                price: productUpdate.price
            });
        }


    }, [productUpdate, form])


    const handleLoadCategory = async () => {
            const res = await getListCategory();
            if (res) {
                setCategory(res?.data?.content ?? []);
            }
        }
        
        useEffect(() => {
            handleLoadCategory();
        }, []);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        
        console.log('Success:', values);
        const res = await updateProduct(id ?? 0, values.name ?? '', values.status ?? 1, values.quantity ?? 1, values?.image?.file?.originFileObj ?? '', values.category ?? 1 ).then((res) => {
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
                title="Update Product"
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name !!!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Status"
                        name="status"
                        rules={[

                            // { type: "email", message: "Not valid fomat email !" }
                        ]}>
                        <Select
                            // defaultValue="1"
                            style={{ width: 120 }}
                            // onChange={() => }
                            options={[
                                { value: '1', label: 'Active' },
                                { value: '0', label: 'Inactive' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                min: 1,
                                max: 5,
                                message: "not valid format number",
                                pattern: new RegExp(/^[0-9]+$/)
                            }
                        ]}
                    >
                        <Input type='number' maxLength={5} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Quantity"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                min: 1,
                                max: 5,
                                message: "not valid format number",
                                pattern: new RegExp(/^[0-9]+$/)
                            }
                        ]}
                    >
                        <Input type='number' maxLength={5} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Category"
                        name="category"
                        rules={[
                            // { required: true },
                            // { type: "email", message: "Not valid fomat email !" }
                        ]}>
                        <Select
                            // defaultValue={category[0]?.id}
                            style={{ width: 120 }}
                            options={category.map((item) => ({
                                value: item.id,
                                label: item.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Image"
                        name="image"
                        >
                        <Upload showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
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

export default ModalUpdateProduct