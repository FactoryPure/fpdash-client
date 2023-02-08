import logo from "../logo.png"

export default function Topbar({ title }) {
    return (
        <div className="topbar">
            <div className="topbar__row">
                <img
                    src={logo}
                    alt="logo"
                    width="50"
                    height="50"
                    loading="lazy"
                />
            </div>
            <h1 className="topbar__heading">{title}</h1>
        </div>
    )
}