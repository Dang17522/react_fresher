import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getUserByToken } from "@/services/api";
import { DotLoader, PuffLoader } from "react-spinners";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user, setIsAuthenticated, setUser, setAppLoading, appLoading } = useCurrentApp();
    const location = useLocation();
    const isAdminRoute = location.pathname.includes("admin");
    const token = localStorage.getItem('token') ?? '';
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserByToken(token);
            console.log("fetchUserToken: ", res);
            if (res.data?.status === 200) {
                setIsAuthenticated(true);
                setUser(res.data?.data);
            } else if (res?.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('refeshToken');
            }
            setAppLoading(false);
        }
        if (token !== '') {
            fetchUser();
        } else {
            setAppLoading(false);
        }

    }, [])
    // const navigate = useNavigate();

    if (appLoading) {
        return (
            <DotLoader
            color="#4a0fff"
            cssOverride={{ position: "fixed", top: "50%", left: "50%", }}
            size={90}
            speedMultiplier={1}
        />
        )
    } else {
        if (!isAuthenticated) {
            console.log("user", user);
            return (
                <Result
                    status="403"
                    title="Xác thực người dùng"
                    subTitle="Xin lổi bạn cần đăng nhập để thực hiện chức năng này"
                    extra={<Link to={"/login"}><Button type="primary">Login</Button></Link>}
                />
            )

        } else if (isAdminRoute && user?.role !== 'Admin') {
            return (
                <Result
                    status="500"
                    title="Lổi Xác thực người dùng"
                    subTitle="Bạn không có quyền để thực hiện chức năng này"
                    extra={<Link to={"/login"}><Button type="primary">Login</Button></Link>}
                />
            )
        }
    }

    return (
        <div>
            {props.children}
        </div>
    )
}

export default ProtectedRoute