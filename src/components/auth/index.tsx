import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    const isAdminRoute = location.pathname.includes("admin");
    // const navigate = useNavigate();

    if (!isAuthenticated) {
        console.log("isAuthenticated", isAuthenticated);
        return (
            <Result
                status="403"
                title="Xác thực người dùng"
                subTitle="Xin lổi bạn cần đăng nhập để thực hiện chức năng này"
                extra={<Link to={"/login"}><Button type="primary">Login</Button></Link>}
            />
        )

    }else if(isAdminRoute && user?.role !== 'Admin'){
        return (
            <Result
                status="500"
                title="Lổi Xác thực người dùng"
                subTitle="Bạn không có quyền để thực hiện chức năng này"
                extra={<Link to={"/login"}><Button type="primary">Login</Button></Link>}
            />
        )
    }
    return (
        <div>
            {props.children}
        </div>
    )
}

export default ProtectedRoute