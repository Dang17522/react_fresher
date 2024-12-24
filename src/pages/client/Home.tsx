import { Button, Checkbox, Col, Divider, Flex, InputNumber, Layout, Rate, Row, Slider } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import type { CheckboxProps, GetProp } from 'antd';
import { useState } from "react";
import { LiaFillSolid } from "react-icons/lia";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
const HomePage = () => {

  const [valueFirst, setValueFirst] = useState(20);
  const [valueSecond, setValueSecond] = useState(50);

  const [valueSelectFirst, setValueSelectFirst] = useState(20);
  const [valueSelectSecond, setValueSelectSecond] = useState(50);
  const [value, setValue] = useState(3);
  const desc = ['kinh khủng', 'xấu', 'Bình thường', 'Tốt', 'tuyệt vời'];
  const plainOptions = ['Apple', 'Pear', 'Orange'];
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const CheckboxGroup = Checkbox.Group;
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;


  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    console.log(e.target.checked );
    console.log(plainOptions);
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
  };

  const siderStyle: React.CSSProperties = {
    // marginLeft: "30px",
    color: '#fff',
    backgroundColor: '#fff',
  };

  const handleChangeFirst = (value: any) => {
    console.log("handleChangeFirst", value);
    setValueSelectFirst(value);
    setValueFirst(value);
  }

  const handleChangeSecond = (value: any) => {
    console.log("handleChangeSecond", value);
    setValueSelectSecond(value);
    setValueSecond(value);
  }

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setValueFirst(checkedValues[0] as number);
    setValueSecond(checkedValues[1] as number);
  };

  const onChangeCheckInput = (list: string[]) => {
    setCheckedList(list);
    console.log('list = ', list);
  };
  return (
    <div>
      <Layout>
        <Layout>
          <Sider width="25%" style={siderStyle}>
            <div style={{marginLeft: "10px"}}>
              <h2 style={{ textAlign: "center", color: "black" }}>Lọc sản phẩm <LiaFillSolid /></h2>
              <Checkbox.Group style={{ width: '100%', margin: "0px", padding: "0px" }}>
                <Row>
                  <span>Danh mục sản phẩm</span>
                  
                  <Divider />
                  <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChangeCheckInput} />
                  <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    Check all
                  </Checkbox>
                </Row>
              </Checkbox.Group>

              <div style={{ paddingTop: "60px", color: "black" }}>Theo giá sản phẩm <RiMoneyDollarBoxLine /></div>
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
              <div style={{ marginTop: "60px", color: "black", textAlign: "center" }}>Theo đánh giá </div>
              <Flex gap="middle" vertical style={{ textAlign: "center" }}>
                <Rate tooltips={desc} onChange={setValue} value={value} />
                {value ? <span>{desc[value - 1]}</span> : null}
              </Flex>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <Button type="primary">Tìm kiếm</Button>
              </div>
            </div>
          </Sider>
          <Content style={contentStyle}>Content</Content>

        </Layout>
      </Layout>
    </div>
  )
}

export default HomePage