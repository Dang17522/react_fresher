import { createProduct, getListCategory } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Rate, Select, Upload, UploadFile, UploadProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { GiNewShoot } from 'react-icons/gi';
type FieldType = {
    name?: string;
    status?: number;
    quantity?: number;
    vote?: number;
    image?: any;
    description?: string;
    category?: number;
    price?: number;
    author?: string
};
const ModalAddProduct = (props: any) => {

    const { modalOpen, setModalOpen } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<ICategory[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([

    ]);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        console.log('Success:', values.image.fileList);
        const res = await createProduct(values.name ?? '',values.author ?? '', values.status ?? 1, values.price ?? 1, values.quantity ?? 1, values?.image?.fileList ?? '', values.category ?? 1, values.description ?? '', values.vote ?? 0);
        console.log(res);
        if (res.data && res.data.status && res.data.status === 200) {
            messageApi.open({
                type: 'success',
                content: 'Create new product successfully',
            });

        } else {
            messageApi.open({
                type: 'error',
                content: res?.data?.message,
            });
        }

        console.log(res);
        setLoading(false);
        setModalOpen(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLoadCategory = async () => {
        const res = await getListCategory();
        if (res) {
            setCategory(res?.data?.content ?? []);
        }
    }



    const handleChange: UploadProps['onChange'] = (info) => {
        let newFileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-7);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(newFileList);
    };

    const propss = {
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange: handleChange,
        multiple: true,
    };

    useEffect(() => {
        handleLoadCategory();
    }, []);
    return (
        <div>
            {contextHolder}
            <Modal width={500}
                title="Create New Product"
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name  !!!' },
                            {max: 20, message: 'Name must be less than 20 characters'}
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Author"
                        name="author"
                        rules={[{ required: true,  message: 'Please enter author !!!' },
                            {max: 20, message: 'Author must be less than 20 characters'}
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Status"
                        name="status"
                        rules={[

                            // { type: "email", message: "Not valid fomat email !" }
                        ]}>
                        <Select
                            defaultValue="1"
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
                                pattern: new RegExp(/^[1-9]+$/)
                            }
                        ]}
                    >
                        <Input type='number' maxLength={5} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Quality"
                        name="vote"
                        rules={[
                            {
                                required: true,
                              
                            }
                        ]}
                    >
                        <Rate/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: false,
                            }
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Category"
                        name="category"
                        rules={[
                            // { required: true },
                            // { type: "email", message: "Not valid fomat email !" }
                        ]}>
                        <Select
                            defaultValue={category[0]?.id}
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
                        rules={[{ required: true },

                        ]}>
                        <Upload  {...propss} fileList={fileList} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create <GiNewShoot />
                        </Button>
                        <Button type="dashed" loading={loading} onClick={() => setModalOpen(false)} style={{ marginLeft: '10px' }}>
                            Cancel <FcCancel />
                        </Button>
                    </Form.Item>
                    <Divider style={{ borderColor: '#7cb305', width: '200px' }} ></Divider>

                </Form>

            </Modal>
        </div>
    )
}

export default ModalAddProduct