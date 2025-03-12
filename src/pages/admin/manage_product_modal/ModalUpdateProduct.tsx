import { deleteProductMultiImage, getListCategory, updateProduct } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Form, Image, Input, message, Modal, Popconfirm, PopconfirmProps, Rate, Select, Upload, UploadFile, UploadProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';
import { RiDeleteBackLine } from 'react-icons/ri';
type FieldType = {
    id: number,
    name: string,
    status: number,
    image: any,
    quantity: number,
    description: string,
    vote: number,
    createAt: Date,
    category: any,
    price: number,
    author: string
};
const ModalUpdateProduct = (props: any) => {
    const { modalUpdateOpen, setModalUpdateOpen, productUpdate, setProductUpdate } = props;
    const [category, setCategory] = useState<ICategory[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [form] = Form.useForm();
    const [id, setId] = useState<number>();
    useEffect(() => {
        console.log("productUpdate: ", productUpdate);
        if (productUpdate) {
            setId(productUpdate.id)
            form.setFieldsValue({
                name: productUpdate.name,
                author: productUpdate.author,
                status: productUpdate.status == 1 ? 'Active' : 'Inactive',
                // image: productUpdate.image,
                quantity: productUpdate.quantity,
                description: productUpdate.description,
                category: productUpdate.category,
                price: productUpdate.price,
                vote: productUpdate.vote
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
        const res = await updateProduct(id ?? 0, values.name ?? '', values.author ?? '', values.status ?? 1, values.quantity ?? 1, values?.image?.fileList ?? '', values.category ?? 1, values.description ?? '', values.vote ?? 0, values.price ?? 1);
        if (res.data && res.data.status && res.data.status === 200) {
            messageApi.open({
                type: 'success',
                content: res?.data?.message,
            });

        } else {
            messageApi.open({
                type: 'error',
                content: res?.data?.message,
            });

        }
        setLoading(false);
        setModalUpdateOpen(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
    };

    const handleDelete = async (productId: number, id: number) => {
        const res = await deleteProductMultiImage(productId, id);
        console.log(res);
        if (res?.data?.status === 200) {
            message.success(res?.data?.message);
            setProductUpdate(res?.data?.data);
        } else {
            message.error(res?.data?.message);
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
                        rules={[{ required: true, message: 'Please enter name  !!!' },
                        { max: 20, message: 'Name must be less than 20 characters' }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Author"
                        name="author"
                        rules={[{ required: true, message: 'Please enter author !!!' },
                        { max: 20, message: 'Author must be less than 20 characters' }
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
                        label="Description"
                        name="description"

                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Quality"
                        name="vote"

                    >
                        <Rate />
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
                        <Upload  {...propss} fileList={fileList} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>



                    </Form.Item>
                    <Form.Item<FieldType>>
                        <Button style={{ backgroundColor: '#7cb305' }} type="primary" onClick={showDrawer}>
                            See Multi Image
                        </Button>
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

            <Drawer title="Multi Image" onClose={onClose} open={open}>
                {productUpdate?.productMultiImage.map((item: any, index: number) => (
                    <div key={index}>
                        <Image.PreviewGroup
                            items={productUpdate?.productMultiImage.map((item: any) => ({
                                src: item.image
                            }))}
                        >
                            <Image
                                width={100}
                                src={item.image}
                                style={{ marginBottom: '10px' }}
                            />
                            <Popconfirm
                                title="Delete Image"
                                description={
                                    <div>
                                        Are you sure to delete image <img src={item.image} width={50} />
                                    </div>
                                }
                                onConfirm={() => handleDelete(productUpdate.id, item.id)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={{ color: 'red', marginLeft: '10px' }}><RiDeleteBackLine /></Button>

                            </Popconfirm>
                        </Image.PreviewGroup>
                    </div>


                ))}
            </Drawer>
        </div>
    )
}

export default ModalUpdateProduct