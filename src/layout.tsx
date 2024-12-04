import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/AppHeader"
import { getUserByToken } from "./services/api"
import { useCurrentApp } from "./components/context/app.context";
import { PuffLoader } from "react-spinners";

function Layout() {
  const token = localStorage.getItem('token') ?? '';
  const { setIsAuthenticated, setUser, appLoading, setAppLoading } = useCurrentApp();
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
    }
    if (token !== '') {
      fetchUser();
    }
    setAppLoading(false);
  }, [])
  return (
    <div>
      {appLoading ? <PuffLoader
        color="#4a0fff"
        cssOverride={{ position: "fixed", top: "50%", left: "50%", }}
        size={90}
        speedMultiplier={1}
      /> : <>
        <AppHeader />
        <Outlet />
      </>}
    </div>


  )
}

export default Layout
