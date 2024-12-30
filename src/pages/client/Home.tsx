import { getListCategory, getListProductByFilter } from "@/services/api";
import type { CheckboxProps, GetProp, PaginationProps, TabsProps } from 'antd';
import { Button, Card, Checkbox, Col, Divider, Flex, Form, InputNumber, Layout, message, Pagination, Rate, Row, Slider, Space, Spin, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { FaAmazonPay } from "react-icons/fa";
import { LiaCartPlusSolid, LiaFillSolid } from "react-icons/lia";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { ClimbingBoxLoader } from "react-spinners";
const HomePage = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [valueFirst, setValueFirst] = useState(20);
  const [valueSecond, setValueSecond] = useState(50);
  const [valueSelectFirst, setValueSelectFirst] = useState(20);
  const [valueSelectSecond, setValueSelectSecond] = useState(50);
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);
  // const desc = ['kinh khủng', 'xấu', 'Bình thường', 'Tốt', 'tuyệt vời'];
  // const plainOptions = ['Apple', 'Pear', 'Orange'];
  const [checkedList, setCheckedList] = useState<string[] | number[]>([]);
  const CheckboxGroup = Checkbox.Group;
  const { Meta } = Card;
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState<ICategory[]>([]);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSizeData, setPageSizeData] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [checkAll, setCheckAll] = useState(listCategory.length === checkedList.length);
  const indeterminate = checkedList.length > 0 && checkedList.length < listCategory.length;
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? listCategory.map((item) => item.name) : []);

    form.setFieldsValue({ category: e.target.checked ? listCategory.map((item) => item.name) : [] });
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    marginLeft: "10px",
  };

  const siderStyle: React.CSSProperties = {
    // marginLeft: "30px",
    color: '#fff',
    backgroundColor: '#fff',
  };

  const handleChangeFirst = (value: any) => {
    setValueSelectFirst(value);
    setValueFirst(value);

    form.setFieldsValue({ price: [value, valueSecond] });
  }

  const handleChangeSecond = (value: any) => {
    setValueSelectSecond(value);
    setValueSecond(value);

    form.setFieldsValue({ price: [valueFirst, value] });
  }

  const handleRateChange = (value: number) => {
    setValue(value);

    // Update form
    form.setFieldsValue({ rate: value });
  };

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setValueFirst(checkedValues[0] as number);
    setValueSecond(checkedValues[1] as number);
    setValueSelectFirst(checkedValues[0] as number);
    setValueSelectSecond(checkedValues[1] as number);

    form.setFieldsValue({ price: checkedValues });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Phổ biến',
      // children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Sản phẩm mới cập nhật',
      // children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Giá từ thấp đến cao',
      // children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: 'Giá từ cao đến thấp',
      // children: 'Content of Tab Pane 3',
    },
  ];

  const onChangeNav = (key: string) => {
    console.log(key);
  };

  const onChangeCheckInput = (list: string[]) => {
    setCheckedList(list);

    form.setFieldsValue({ category: list });
    if(checkedList.length === listCategory.length){
      setCheckAll(true);
    }
    console.log("checkedList", checkedList.length);
    console.log("listCategory", listCategory.length);
  };

  const onFinishForm = (values: any) => {
    // Update form values with current state
    const formData = {
      ...values,
      category: checkedList,
      price: [valueFirst, valueSecond],
      rate: value
    };

    console.log('Form submitted with values:', formData);
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const fetchCategories = async () => {
    const res = await getListCategory();
    if (res) {
      setListCategory(res?.data?.content ?? []);
    }
  }

  const fetchListProduct = async () => {
    const res = await getListProductByFilter("", "createAt",checkedList, [valueFirst, valueSecond], value, pageSizeData, pageNumber);
    if (res) {
      setListProduct(res?.data?.content ?? []);
      setTotalPage(res?.data?.totalPages ?? 0);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, [])

  useEffect(() => {
    fetchListProduct();
    setAppLoading(false);
  }, [pageNumber, pageSizeData, valueFirst, valueSecond, value, checkedList])

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setLoading(true);
    if (current !== pageNumber) {
      setPageNumber(current);
    }
    if (pageSizeData !== pageSize) {
      setPageSizeData(pageSize);
    }
    setLoading(false);
  };
  return (
    <div>

     {appLoading ? <ClimbingBoxLoader  color="#4a0fff"
        cssOverride={{ position: "fixed",  left: "50%", }}
        size={10}
        speedMultiplier={1}/> : <>
      <Layout>
        <Layout>
          <Sider width="25%" style={siderStyle}>
            <div style={{ marginLeft: "10px" }}>
              <h2 style={{ textAlign: "center", color: "black" }}>Lọc sản phẩm <LiaFillSolid /></h2>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinishForm}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Divider />
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                // rules={[{ required: true }, { type: 'url', warningOnly: true }, { type: 'string', min: 6 }]}
                >
                  <Checkbox.Group style={{ width: '100%', margin: "0px", padding: "0px" }}>
                    <CheckboxGroup options={listCategory.map((item: any) => item.name)} value={checkedList.map((item: any) => item)} onChange={onChangeCheckInput} />
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                      Check all
                    </Checkbox>

                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  name="price"
                  label={
                    <div>
                      <div style={{ paddingTop: "10px", color: "black" }}>Theo giá sản phẩm <RiMoneyDollarBoxLine /></div>
                    </div>
                  }
                >
                  <Slider range={{ draggableTrack: true }} value={[valueSelectFirst, valueSelectSecond]} onChange={onChange} max={200} />
                  <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Col md={8} sm={24} xs={24} >
                      <InputNumber value={valueFirst} onChange={(e) => handleChangeFirst(e as number)} min={0} max={200}
                      />
                    </Col>
                    <Col md={8} sm={24} xs={24}>
                      <InputNumber value={valueSecond} onChange={(e) => handleChangeSecond(e as number)} min={0} max={200}
                      />
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  name="rate"
                  label={
                    <div>
                      <div style={{ paddingTop: "10px", color: "black" }}>Theo đánh giá <RiMoneyDollarBoxLine /></div>
                    </div>
                  }
                >
                  <Flex gap="middle" vertical style={{ textAlign: "center" }}>
                    <Rate onChange={handleRateChange} value={value} />
                    {/* {value ? <span>{desc[value - 1]}</span> : null} */}
                  </Flex>
                </Form.Item>
                <Form.Item>
                  <Space style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" >
                      Tìm kiếm
                    </Button>

                  </Space>
                </Form.Item>
              </Form>

            </div>
          </Sider>
          <Content style={contentStyle}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChangeNav} />
            <Spin tip="Loading" spinning={loading}> 
            <Row >
              {listProduct.map((item: any) => (
                <Col span={6} style={{ marginBottom: "20px" }}>
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={item.image} height={200} />}
                    actions={[
                      <FaAmazonPay fontSize={30} key="setting" />,
                      <LiaCartPlusSolid fontSize={30} key="edit" />,
                      <Rate value={item.vote} disabled/>
                    ]}
                  >
                    <Meta title={item.name} description={<div style={{ color: "#99CC33" }}>
                      {item.price + " $"}
                    </div>} />
                  </Card>
                </Col>
              ))}

            </Row>
            </Spin>
            <Divider />
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Pagination current={pageNumber} pageSize={pageSizeData} total={totalPage} onChange={onShowSizeChange}
                showTotal={(totalPage, range) => (
                  <span style={{ right: 0 }}>
                    Showing {range[0]}-{range[1]} of {totalPage}
                  </span>
                )}
              />
            </Row>
          </Content>

        </Layout>
      </Layout>
     </>}
    </div>
  )
}

export default HomePage