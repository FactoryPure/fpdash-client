import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import "./AdminScreen.css"

export default function AdminScreen() {
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const navigate = useNavigate()
    useEffect(() => {
        if (!user.access.includes("*")) {
            navigate("/home")
        }
    }, [])
    const handleRefreshCollectionProducts = () => {
        const confirm = window.confirm("Are you sure? This can take up to ten minutes.")
        if (confirm) {
            fetch("https://www.fp-development.com/sync/products", {
                headers: {
                    Authorization: "PleaseLetMeDoThisUpdatePrettyPrettyPleaseManINeedThisOne"
                }
            }).then(res => res.json()).then(res => {
                alert(res.message)
            }).catch(console.log)
        }
    }
    const handleSyncMessages = () => {
        const confirm = window.confirm("Are you sure? This may take a few minutes.")
        if (confirm) {
            fetch("https://api.fpdash.com/shipping/sync", {
                headers: {
                    Authorization: sessionToken
                }
            }).then(res => res.json()).then(res => {
                alert(res.message)
            }).catch(console.log)
        }
    }
    return (
        <div className="admin">
            <button className="admin__reset-products" onClick={handleRefreshCollectionProducts}>REFRESH PRODUCTS</button>
            <button className="admin__reset-products" onClick={handleSyncMessages}>REFRESH MESSAGES</button>
        </div>
    )
}