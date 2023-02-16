import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { getData } from "../redux/data"

export default function Sidebar({ access, submenu }) {
    const navigate = useNavigate()
    const location = useLocation()
    const DEFAULT_LIST = [
        "product-setup",
        "shipping",
        "sales",
        "calls",
        "users",
        "admin"
    ]
    const currentList = access.includes("*") ? DEFAULT_LIST : access
    return (
        <div className="sidebar">
            <div 
                className={location.pathname === `/home` 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate(`/home`)}
            >Home</div>
            {currentList.map(item => <>
                <div 
                    className={location.pathname.includes(`/${item}`)
                        ? 'sidebar__menu__item sidebar__menu__item--selected'
                        : 'sidebar__menu__item'
                    } 
                    onClick={() => navigate(`/${item}`)}
                >
                    {item.replaceAll("-", " ")}
                </div>
                {location.pathname.includes(`/${item}`) && submenu && submenu.map(subitem => <div 
                    className={location.pathname === `/${item}/${subitem}` 
                        ? 'sidebar__menu__subitem sidebar__menu__subitem--selected'
                        : 'sidebar__menu__subitem'
                    } 
                    onClick={() => navigate(`/${item}/${subitem}`)}
                >
                    {subitem.replaceAll("-", " ")}
                </div>)}
            </>)}
        </div>
    )
}