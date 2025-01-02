import { getProductById } from "@/services/api";
import { Alert, Button, Col, Input, Rate, Row } from "antd";
import { useEffect, useState } from "react";
import { PiShoppingCart } from "react-icons/pi";
import ReactImageGallery from "react-image-gallery";
import { useParams } from "react-router-dom";

const BookPage = () => {
  const [value, setValue] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/1000/600/",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/1000/600/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];

  const getDataById = async () => {
    const res = await getProductById(Number(id));
    console.log(res);
    if(res) {
      setProduct(res?.data?.data);
    }
  }
  useEffect(() => {
    getDataById();
  },[id])
  return (
    <div>
      <Row >
        <Col sm={24} md={12}>
          <ReactImageGallery items={images} showNav={false} showFullscreenButton={false} showPlayButton={false} showBullets={false} />

        </Col>
        <Col sm={24} md={12} style={{ paddingLeft: 20 }}>
          <Alert message={<span>Tác giả: <a>abc</a></span>} type="success" style={{marginRight: 10}} />
          <br />
          <h1>{product?.name}</h1>
          <Rate value={product?.vote} disabled style={{ paddingTop: 10, paddingBottom: 10 }} />
          <br />
          <Col span={24}>
          <Alert message={<div>Thông tin thêm: <span style={{color: 'green'}}>{product?.description ? product?.description : 'Hiện không có thông tin'}</span></div>}  type="warning" style={{marginRight: 10}} />
          </Col>
          <br />
          <Alert message={<div>Sản phẩm hiện có:<span> {product?.quantity}</span></div>} type="info" style={{ width: 190 }} />
          <br />
          <Alert message={<span>{product?.price} $</span>} type="error" style={{ width: 200 }} />
          <br />
          <Row>
            <Col><span>Số lượng:  </span></Col>
            <Col style={{ paddingLeft: 10 }}><Button onClick={() => setValue(value - 1)} >-</Button></Col>
            <Col><Input style={{ width: 50, textAlign: 'center', marginLeft: 5, marginRight: 5 }} value={value} min={1} /></Col>
            <Col><Button onClick={() => setValue(value + 1)}>+</Button></Col>
          </Row>

          <Row style={{ paddingTop: 20 }}>
            <Col><Button type="primary">Thêm Vào Giỏ Hàng <PiShoppingCart /></Button></Col>
            <Col style={{ paddingLeft: 10, }}><Button style={{ backgroundColor: '#FF3300', color: 'white' }}>Mua Ngay</Button></Col>
          </Row>

        </Col>

      </Row>
    </div>
  )
}

export default BookPage