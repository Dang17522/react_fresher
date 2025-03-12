import { Flex, Skeleton, Space } from 'antd';
import { useState } from 'react';

const ProductDetailLoading = (props:any) => {
  type SizeType = 'default' | 'small' | 'large';
  const {activeLoading, setActiveLoading} = props
  const [block, setBlock] = useState(false);
  const [size, setSize] = useState<SizeType>('default');
  type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
  type AvatarShapeType = 'circle' | 'square';
  const [buttonShape, setButtonShape] = useState<ButtonShapeType>('default');
  const [avatarShape, setAvatarShape] = useState<AvatarShapeType>('circle');

  return (
    <div>
      <Flex gap="middle" vertical>

        <Space>


          <Space style={{ width: '100%' }}>

            <div style={{ marginLeft: 40 }}>
              <Skeleton.Node active={activeLoading} style={{ width: '300px' }} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Skeleton.Image active={activeLoading} style={{ marginTop: 10 }} />
                <Skeleton.Image active={activeLoading} style={{ marginTop: 10, marginLeft: 10 }} />
                <Skeleton.Image active={activeLoading} style={{ marginTop: 10, marginLeft: 10 }} />
              </div>
              <br />
            </div>

          </Space>

          <Space style={{ width: '100%', marginLeft: '50px' }}>
            <Skeleton.Input active={activeLoading} />

          </Space>

        </Space>

      </Flex>
    </div>
  )
}

export default ProductDetailLoading