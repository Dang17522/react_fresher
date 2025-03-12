import { getProductByAuthor, getProductById } from "@/services/api";
import { Alert, Button, Col, Divider, Input, Rate, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { PiShoppingCart } from "react-icons/pi";
import ReactImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { LoadingOutlined } from "@ant-design/icons";
import ProductDetailLoading from "./ProductDetailLoading";
import { useCurrentApp } from "@/components/context/app.context";
const ProductDetail = () => {
  const [value, setValue] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [productAuthor, setProductAuthor] = useState<IProduct[]>();
  const [cart, setCart] = useState<ICart[]>(()=>{
    const saveCart = localStorage.getItem('cart');
    return saveCart ? JSON.parse(saveCart) : [];
  });
  const { isAuthenticated,setCoutCart } = useCurrentApp();

  const images = product?.productMultiImage.map((item) => ({ original: item.image, thumbnail: item.image, originalHeight: 350, thumbnailHeight: 80 })) || [];
  const [activeLoading, setActiveLoading] = useState<any>(true);
  const navigate = useNavigate();
  const getDataById = async () => {
   
    const res = await getProductById(Number(id));
    if (res) {
      setProduct(res?.data?.data);
    }

    setActiveLoading(false);
  }

  const getDataByAuthor = async () => {
    const res = await getProductByAuthor(Number(id));
    if (res.data?.status === 200) {
      setProductAuthor(res?.data?.data);
    }
  }

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  const handleChangeValue = (e: number) => {
    if(e < 1){
      setValue(1);
    }else if(e > product?.quantity! ){
      setValue(product?.quantity!);
    }else{
    setValue(e);
    }
  }

  const handleAddToCart = (product: IProduct | undefined,value: number) => {
    if(!isAuthenticated){
      navigate('/login');
    }
    const dataCart = localStorage.getItem('cart');
    let cartItem = dataCart ? JSON.parse(dataCart) : [...cart];
    const id =  product?.id;
    const existingProductIndex = cartItem.findIndex(
      (item: ICart) => item?.product?.id == id
    )
    let count = 0;
    for(let i = 0; i < cartItem.length; i++){
      count += cartItem[i].value
    }
    setCoutCart(count);

    let updatedCart: ICart[];
    if(existingProductIndex >=0){
      updatedCart = [...cartItem];
      updatedCart[existingProductIndex].value += value;
    
    }else{
      updatedCart = [...cartItem, { product, value: value }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart",JSON.stringify(updatedCart));
  }
  useEffect(() => {
    getDataById();
    getDataByAuthor();
  }, [id])
  return (
    <div>
      {activeLoading ? <ProductDetailLoading activeLoading={activeLoading} setActiveLoading={setActiveLoading} /> : <Row >
        <Col sm={24} md={12}>
          <div style={{ width: '400px', height: '100px', margin: "auto", marginBottom: "350px" }}>
            <ReactImageGallery items={images} showNav={false} showFullscreenButton={false} showPlayButton={false} showBullets={false} />
          </div>

        </Col>
        <Col sm={24} md={12} style={{ paddingLeft: 20 }}>
          <Alert message={<span>Tác giả: <a>{product?.author}</a></span>} type="success" style={{ marginRight: 10 }} />
          <br />
          <h1>{product?.name}</h1>
          <Rate value={product?.vote} disabled style={{ paddingTop: 10, paddingBottom: 10 }} />
          <br />
          <Col span={24}>
            <Alert message={<div>Thông tin thêm: <span style={{ color: 'green' }}>{product?.description ? product?.description : 'Hiện không có thông tin'}</span></div>} type="warning" style={{ marginRight: 10 }} />
          </Col>
          <br />
          <Alert message={<div>Sản phẩm hiện có:<span> {product?.quantity}</span></div>} type="info" style={{ width: 190 }} />
          <br />
          <Alert message={<span>Giá: {product?.price} $</span>} type="error" style={{ width: 200 }} />
          <br />
          <Row>
            <Col><span>Số lượng:  </span></Col>
            <Col style={{ paddingLeft: 10 }}><Button onClick={() => handleChangeValue(value - 1)} >-</Button></Col>
            <Col><Input style={{ width: 50, textAlign: 'center', marginLeft: 5, marginRight: 5 }} value={value} min={1} max={product?.quantity} onChange={(e) => handleChangeValue(Number(e.target.value))} /></Col>
            <Col><Button onClick={() => handleChangeValue(value + 1)}>+</Button></Col>
          </Row>

          <Row style={{ paddingTop: 20 }}>
            <Col><Button type="primary" onClick={() => handleAddToCart(product, value)}>Thêm Vào Giỏ Hàng <PiShoppingCart /></Button></Col>
            <Col style={{ paddingLeft: 10, }}><Button style={{ backgroundColor: '#FF3300', color: 'white' }}>Mua Ngay</Button></Col>
          </Row>

        </Col>

      </Row>}
      
      <Divider style={{ borderColor: '#7cb305' }} ><p>Các sản phẩm khác cùng tác giả</p></Divider>
      <div style={{ height: '100px', paddingLeft: 20, marginBottom: 100 }}>
        <Carousel
          centerMode={true}
          // swipeable={false}
          // draggable={false}
          arrows={false}
          // showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          // keyBoardControl={true}
          // customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
        // itemClass="carousel-item-height-850"
        >
          {productAuthor && productAuthor.length > 0 ? productAuthor.map((item, index) => (
            <div key={index}>
              <img
                src={item.productMultiImage[0].image}
                alt={item.name}
                width={150}
                height={150}
              />
              <Alert message={item.name} style={{ width: 150, textAlign: 'center' }} type="success" />
            </div>
          )):<>
          <Spin  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </>}


        </Carousel>
      </div>
    </div>
  )
}

export default ProductDetail