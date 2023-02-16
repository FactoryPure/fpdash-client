import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css"

export default function Layout({ children, title, access, submenu }) {
    return (
        <>
            <Topbar title={title} />
            <Sidebar access={access} submenu={submenu}/>
            <main className="content">
                {children}
            </main>
        </>
    )
}