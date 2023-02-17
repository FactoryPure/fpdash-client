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
            fetch("https://api.fp-development.com/sync/products", {
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
            <p style={{fontSize: '20px'}}>Collection pages / compare app not reflecting updated product info?</p>
            <button style={{marginBottom: '16px'}} className="admin__reset-products" onClick={handleRefreshCollectionProducts}>REFRESH PRODUCTS</button>
            <p style={{fontSize: '20px'}}>New products carrying old messages?<br/><span style={{fontSize: "14px", display: 'inline-block', fontWeight: 700, lineHeight: '18px', textTransform: 'uppercase'}}>This may trigger a product refresh upon completion,<br/> please give this at least 15 minutes to complete before triggering manually.</span></p>
            <button style={{marginBottom: '16px'}} className="admin__reset-products" onClick={handleSyncMessages}>REFRESH MESSAGES</button>
        </div>
    )
}