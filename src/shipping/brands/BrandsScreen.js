import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Modal from "./Modal"
import Brand from "./Brand"
import "./ProductScreen.css"

export default function BrandsScreen() {
    const [focus, setFocus] = useState({})
    const [needsRefresh, setNeedsRefresh] = useState(true)
    const [shippingMessages, setShippingMessages] = useState({})
    const [filteredItems, setFilteredItems] = useState({})
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const navigate = useNavigate()

    useEffect(() => {
        if (sessionToken) {
          if (user && !user.access.includes("shipping") && !user.access.includes("*")) {
              navigate("/home")
          } else if (user && needsRefresh) {
              fetch(`https://api.fpdash.com/shipping?group_by_message=false&include_null_values=false&message_type=collection`, {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: sessionToken
                  }
              }).then(res => res.json()).then(res => {
                  if (res.success) {
                      setShippingMessages(res.collection_messages)
                      setFilteredItems(res.collection_messages)
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
      }, [user, needsRefresh])
      useEffect(() => {
        const searchMap = {}
        search.split(" ").forEach(word => word.length > 0 ? searchMap[word] = 1 : null)
        const filtered = Object.fromEntries(Object.entries(shippingMessages).filter(([key, val]) => {
          return isMatch(val, {...searchMap})
        }))
        setFilteredItems(filtered)
      }, [search])

      const isMatch = (item, searchMap) => {
        const titleArray = item.title.toLowerCase().split(" ")
        const variantTitleArray = item.product_title ? item.product_title.toLowerCase().split(" ") : []
        const variantSearchMap = { ...searchMap }
        let matches = 0
        let variantTitleMatches = 0
        for (let word of titleArray) {
            if (searchMap[word] === 1) {
                matches++
                searchMap[word] = 0
            }
        }
        if (variantTitleArray.length > 0) {
            for (let word of variantTitleArray) {
                if (variantSearchMap[word] === 1) {
                    variantTitleMatches++
                    variantSearchMap[word] = 0
                }
            }
        }
        if (matches === Object.keys(searchMap).length) {
            return true
        } else if (variantTitleMatches === Object.keys(searchMap).length) {
            return true
        } else if (item.title.toLowerCase().includes(search.toLowerCase())) {
            return true
        } else if (item.product_title && item.product_title.toLowerCase().includes(search.toLowerCase())) {
            return true
        } else if (item.sku && item.sku.toLowerCase() === search.toLowerCase()) {
            return true
        }
        return false
      }
    return (
        <>
          {user && (
            <>
              <div className="messages__heading-row">
                <h2 className="messages__heading">Brand Messages</h2>
                <div className="messages__search">
                  <input className="messages__search__input" value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search" />
                </div>
              </div>
              {Object.entries(filteredItems).map(([key, val]) => { return { message_id: key, ...val} }).map(b => <Brand brand={b} setFocus={setFocus} />)}
              <Modal focus={focus} setFocus={setFocus} setNeedsRefresh={setNeedsRefresh} />
            </>
          )}
        </>
    )
}