import { Layout } from 'antd';
const { Footer } = Layout;

const FooterPage = () => {
    return (
        <Layout>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    )
}

export default FooterPage