import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AdminScreen() {
    const { user } = useSelector(state => state)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user.access.includes("*")) {
            navigate("/home")
        }
    }, [])
    const handleRefresh = () => {
        const confirm = window.confirm("Are you sure? This can take up to ten minutes.")
        if (confirm) {
            fetch("https://api.fpdash.com/sync/products", {
                headers: {
                    Authorization: "PleaseLetMeDoThisUpdatePrettyPrettyPleaseManINeedThisOne"
                }
            }).then(res => res.json()).then(res => {
                alert(res.message)
            }).catch(console.log)
        }
    }
    return (
        <div className="admin">
            <button className="admin__reset-products" onClick={handleRefresh}>REFRESH PRODUCTS</button>
        </div>
    )
}