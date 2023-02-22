import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminScreen from "../admin/AdminScreen";
import CallsScreen from "../calls/CallsScreen";
import HomeScreen from "../home/HomeScreen";
import LayoutLogin from "../layout/LayoutLogin";
import LoginScreen from "../login/LoginScreen";
import ProductSetup from "../productSetup/ProductSetup";
import SalesScreen from "../sales/SalesScreen";
import ScrapeScreen from "../scrape/ScrapeScreen";
import SetupScreen from "../setup/SetupScreen";
import BrandsScreen from "../shipping/brands/BrandsScreen";
import MessageScreen from "../shipping/messages/MessageScreen";
import NewMessageScreen from "../shipping/new/NewMessageScreen";
import ProductsScreen from "../shipping/products/ProductScreen";
import VariantsScreen from "../shipping/variants/VariantsScreen";
import UsersScreen from "../users/UsersScreen";

export default function Router() {
    const { user } = useSelector(state => state)
    const ROUTE_MAP = [
        <Route path="home" element={<HomeScreen />} />,
        <Route path="shipping">
            <Route index={true} element={<Navigate to={"/shipping/messages"} />} />
            <Route path="messages" element={<MessageScreen />} />
            <Route path="ending" element={<MessageScreen mode={'ending'} />} />
            <Route path="recent" element={<MessageScreen mode={'recent'} />} />
            <Route path="new" element={<NewMessageScreen />} />
            <Route path="products" element={<ProductsScreen />} />
            <Route path="variants" element={<VariantsScreen />} />
            <Route path="brands" element={<BrandsScreen />} />
        </Route>,
        <Route exact path={"/"} element={
            user ? <Navigate to={"/home"} /> : <Navigate to={"/login"} />
          } />,
        <Route path="create" element={<SetupScreen />} />,
        <Route path={"/login"} element={<LoginScreen />} />,
        <Route path={"/product-setup"} element={<ProductSetup />} />,
        <Route path={"/sales"} element={<SalesScreen />} />,
        <Route path={"/calls"} element={<CallsScreen />} />,
        <Route path={"/users"} element={<UsersScreen />} />,
        <Route path={"/admin"} element={<AdminScreen />} />,
        <Route path={"/scrape"} element={<ScrapeScreen />} />
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
                <Route path={"/create"} element={<SetupScreen />} />
            </Routes>
        }
        </>
    )
}