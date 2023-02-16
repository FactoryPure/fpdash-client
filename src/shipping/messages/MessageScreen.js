import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Message from "./Message"
import "./MessageScreen.css"
import Modal from "./Modal"
export default function MessageScreen({ mode }) {
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const [shippingMessages, setShippingMessages] = useState({})
    const [focus, setFocus] = useState({})
    const [needsRefresh, setNeedsRefresh] = useState(true)
    const [search, setSearch] = useState("")
    const [filteredItems, setFilteredItems] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
      setNeedsRefresh(true)
    }, [mode])
    useEffect(() => {
      if (sessionToken) {
        if (user && !user.access.includes("shipping") && !user.access.includes("*")) {
            navigate("/home")
        } else if (user && needsRefresh) {
            fetch(`https://api.fpdash.com/shipping?group_by_message=true&include_null_values=false${mode ? `&mode=${mode}` : ''}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionToken
                }
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    setShippingMessages(res.message_map)
                    setFilteredItems(res.message_map)
                    setSearch("")
                    setNeedsRefresh(false)
                } else {
                  alert(res.message)
              }
            })
        }
      } else {
        navigate("/home")
      }
    }, [user, needsRefresh, mode])
    useEffect(() => {
      const filtered = Object.fromEntries(Object.entries(shippingMessages).filter(([key, val]) => {
        return key.toLowerCase().includes(search.toLowerCase())
      }))
      setFilteredItems(filtered)
    }, [search])
    return (
        <>
          {user && (
            <>
              <div className="messages__heading-row">
                <h2 className="messages__heading">{mode ? `${mode} Messages` : 'Messages'}</h2>
                <div className="messages__search">
                  <input className="messages__search__input" value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search" />
                </div>
              </div>
              {Object.entries(filteredItems).map(([key, val]) => { return { message_id: key, ...val} }).map(m => <Message key={m.message_id} message={m} setFocus={setFocus} />)}
              <Modal focus={focus} setFocus={setFocus} setNeedsRefresh={setNeedsRefresh} />
            </>
          )}
        </>
    )
}