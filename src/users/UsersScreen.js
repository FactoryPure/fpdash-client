import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Layout from "../layout/Layout"
import Modal from "./Modal"
import User from "./User"
import "./UsersScreen.css"
const DEFAULT_LIST = [
    "*",
    "product-setup",
    "shipping",
    "sales",
    "calls",
    "users"
]
export default function UsersScreen() {
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])
    const [focus, setFocus] = useState({})
    const [showCreate, setShowCreate] = useState(false)
    const [needsRefresh, setNeedsRefresh] = useState(true)
    const { user } = useSelector(state => state)
    const navigate = useNavigate()
    const sessionToken = sessionStorage.getItem("session_token")

    useEffect(() => {
        if (!user.access.includes("*")) {
            navigate("/home")
        } else if (needsRefresh) {
            fetch("http://localhost:8080/users", {
                headers: {
                    Authorization: sessionToken
                }
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    setUsers(res.users)
                }
                setNeedsRefresh(false)
            })
        }
    }, [needsRefresh])
    const createUser = (e) => {
        e.preventDefault()
        let access = Array.from(e.target.querySelectorAll("input[type='checkbox']")).map(item => {
            if (item.checked) return item.value
            return null
        }).filter(a => a)
        if (access.includes("*")) access = ["*"]
        fetch("http://localhost:8080/users/setup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e.target['email'].value,
                type: e.target['type'].value,
                access
            })
        }).then(res => res.json()).then(res => alert(res.message))
    }
    return (
        <>
            {user && (
                <div className="users">
                    <div class="users__row">
                        <h1 className="users__main-heading">Users</h1>
                        <input className="users__search" value={search} onChange={e => setSearch(e.target.value)} type="text" id="search" name="search" placeholder="search" />
                        <button onClick={() => setShowCreate(true)}>Create</button>
                        {showCreate && (
                            <form className="users__new__form" onSubmit={createUser}>
                                <input type="email" name="email" id="email" placeholder="Email Address" />
                                <select name="type" id="type">
                                    <option value="Client">Client</option>
                                    <option value="Admin">Admin</option>
                                    <option value="SuperAdmin">SuperAdmin</option>
                                </select>
                                <p>Access</p>
                                {DEFAULT_LIST.map(route => (
                                    <div>
                                        <input type="checkbox" value={route} name={route} />
                                        <label for={route}>{route.replace("*", "All Routes").split("-").map(val => `${val.substring(0,1).toUpperCase()}${val.substring(1)}`).join(" ")}</label>
                                    </div>
                                ))}
                                <button type="submit">SUBMIT</button>
                                <button type="button" onClick={() => setShowCreate(false)}>CANCEL</button>
                            </form>
                        )}
                    </div>
                    <div className="users__list">
                        {users && users.map(user => <User user={user} setFocus={setFocus} />)}
                    </div>
                </div>
            )}
            <Modal focus={focus} setFocus={setFocus} setNeedsRefresh={setNeedsRefresh} />
        </> 
    )
}