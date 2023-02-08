import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import CallsScreen from "../calls/CallsScreen";
import DescriptionScreen from "../descriptions/DescriptionScreen";
import HomeScreen from "../home/HomeScreen";
import LayoutLogin from "../layout/LayoutLogin";
import LoginScreen from "../login/LoginScreen";
import SalesScreen from "../sales/SalesScreen";
import SetupScreen from "../setup/SetupScreen";
import AllScreen from "../shipping/AllScreen";
import NewMessageScreen from "../shipping/NewMessageScreen";
import UsersScreen from "../users/UsersScreen";

export default function Router() {
    const { user } = useSelector(state => state)
    const ROUTE_MAP = [
        <Route path="home" element={<HomeScreen />} />,
        <Route path="shipping">
            <Route index={true} element={<Navigate to={"/shipping/messages"} />} />
            <Route path="messages" element={<AllScreen />} />
            <Route path="new" element={<NewMessageScreen />} />
        </Route>,
        <Route exact path={"/"} element={
            user ? <Navigate to={"/home"} /> : <Navigate to={"/login"} />
          } />,
          <Route path={"/create"} element={<SetupScreen />} />,
          <Route path={"/login"} element={<LoginScreen />} />,
          <Route path={"/product-setup"} element={<DescriptionScreen />} />,
          <Route path={"/sales"} element={<SalesScreen />} />,
          <Route path={"/calls"} element={<CallsScreen />} />,
          <Route path={"/users"} element={<UsersScreen />} />
    ]
    return (
        <>
        {user ?
            <Routes>
                {ROUTE_MAP.map(item => item)}
            </Routes>
        :
            <Routes>
                <Route path={"/login"} element={<LoginScreen />} />
            </Routes>
        }
        </>
    )
}