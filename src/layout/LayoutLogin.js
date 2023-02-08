import Topbar from "./Topbar";
import "./LayoutLogin.css";

export default function LayoutLogin({ children }) {
    return (
        <>
            <Topbar title={"Dashboard"} />
            <main className="content">
                {children}
            </main>
        </>
    )
}