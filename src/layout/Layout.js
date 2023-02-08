import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css"
import Modal from "./Modal";

export default function Layout({ children, title, access, submenu }) {
    return (
        <>
            <Topbar title={title} />
            <Sidebar access={access} submenu={submenu}/>
            {/* <Modal /> */}
            <main className="content">
                {children}
            </main>
        </>
    )
}