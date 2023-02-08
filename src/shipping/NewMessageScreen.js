import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import "./NewMessageScreen.css"

export default function NewMessageScreen() {
    const initialMessage = {
        message_id: Date.now(),
        pdp_line_1: '',
        pdp_line_2: '',
        cart_line_1: '',
        cart_line_2: '',
        end_date: null,
    }
    const [message, setMessage] = useState(initialMessage)
    const [search, setSearch] = useState("")
    const tempItems = {
        products: [],
        brands: [],
        variants: []
    }
    const [items, setItems] = useState({...tempItems})
    const [filteredItems, setFilteredItems] = useState({...tempItems})
    const [broadFilter, setBroadFilter] = useState("all")
    const [selectedItems, setSelectedItems] = useState([])
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const navigate = useNavigate()
    if (user && !user.access.includes("shipping") && !user.access.includes("*")) {
        navigate("/home")
    }
    const handleChange = ({ target }) => {
        setMessage({
            ...message,
            [target.name]: target.value
        })
    }
    const debouncedSearch = useDebounce(search, 200)
    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(
          () => {
            const handler = setTimeout(() => {
              setDebouncedValue(value.toLowerCase());
            }, delay);
            return () => {
              clearTimeout(handler);
            };
          },
          [value, delay]
        );
        return debouncedValue;
    }
    const handleSearchChange = ({ target }) => {
        setSearch(target.value)
    }
    useEffect(() => {
        const searchMap = {}
        debouncedSearch.split(" ").forEach(word => word.length > 0 ? searchMap[word] = 1 : null)
        const newItems = {
            products: broadFilter === "all" || broadFilter === "products" ? items.products : [],
            brands: broadFilter === "all" || broadFilter === "brands" ? items.brands : [],
            variants: broadFilter === "all" || broadFilter === "variants" ? items.variants : []
        }
        setFilteredItems({
            products: newItems.products.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid)),
            brands: newItems.brands.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid)),
            variants: newItems.variants.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid))
        })
    }, [debouncedSearch, broadFilter, selectedItems])
    const isMatch = (item, searchMap) => {
        const titleArray = item.title.toLowerCase().split(" ")
        let matches = 0
        for (let word of titleArray) {
            if (searchMap[word] === 1) {
                matches++
                searchMap[word] = 0
            }
        }
        if (matches === Object.keys(searchMap).length) {
            return true
        } else if (item.title.toLowerCase().includes(debouncedSearch)) {
            return true
        }
        return false
    }
    useEffect(() => {
        const fetchAndSet = async () => {
            const promises = [
                fetch("http://localhost:8080/collections?brands=true", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionToken
                    }
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        tempItems.brands = res.collections
                    }
                }),
                fetch("http://localhost:8080/products", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionToken
                    }
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        tempItems.products = res.products
                    }
                }),
                fetch("http://localhost:8080/variants", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionToken
                    }
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        tempItems.variants = res.variants
                    }
                })
            ]
            await Promise.all(promises).then(() => {
                setItems(tempItems)
                setFilteredItems(tempItems)
            })
        }
        fetchAndSet()
    }, [])
    const addToSelected = (item) => {
        setSelectedItems([
            ...selectedItems.filter(s => s.gid !== item.gid),
            item
        ])
    }
    const removeFromSelected = (item) => {
        setSelectedItems([
            ...selectedItems.filter(s => s.gid !== item.gid)
        ])
    }
    return (
        <div class="new-message">
            <h2>New Message</h2>
            <div class="new-message__row">
                <form class="new-message__form">
                    <div class="new-message__row">
                        <div class="new-message__group">
                            <label for="message_id" class="new-message__label">
                                Message ID
                            </label>
                            <input 
                                class="new-message__input"
                                type="text"
                                name="message_id"
                                id="message_id"
                                value={message.message_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div class="new-message__group">
                            <label for="end_date" class="new-message__label">
                                End Date
                            </label>
                            <input 
                                class="new-message__input"
                                type="date" 
                                name="end_date"
                                id="end_date"
                                value={message.end_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="new-message__row">
                        <div class="new-message__group">
                            <label for="pdp_line_1" class="new-message__label">
                                PDP Line 1
                            </label>
                            <input 
                                class="new-message__input"
                                type="text"
                                name="pdp_line_1"
                                id="pdp_line_1"
                                value={message.pdp_line_1}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="new-message__row">
                        <div class="new-message__group">
                            <label for="pdp_line_2" class="new-message__label">
                                PDP Line 2
                            </label>
                            <input 
                                class="new-message__input"
                                type="text"
                                name="pdp_line_2"
                                id="pdp_line_2"
                                value={message.pdp_line_2}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="new-message__row">
                        <div class="new-message__group">
                            <label for="cart_line_1" class="new-message__label">
                                Cart Line 1
                            </label>
                            <input 
                                class="new-message__input"
                                type="text"
                                name="cart_line_1"
                                id="cart_line_1"
                                value={message.cart_line_1}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="new-message__row">
                        <div class="new-message__group">
                            <label for="cart_line_2" class="new-message__label">
                                Cart Line 2
                            </label>
                            <input 
                                class="new-message__input"
                                type="text"
                                name="cart_line_2"
                                id="cart_line_2"
                                value={message.cart_line_2}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button class="new-message__submit">CREATE</button>
                </form>
                <div class="new-message__selected">
                    {selectedItems.map(item => <p onClick={() => removeFromSelected(item)}>{item.title}</p>)}
                </div>
            </div>
            <div class="new-message__search-heading-row">
                <p>Applies to</p>
                <div class="new-message__search">
                    <select class="new-message__search__type" value={broadFilter} onChange={(e) => setBroadFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="products">Products</option>
                        <option value="variants">Variants</option>
                        <option value="brands">Brands</option>
                    </select>
                    <input 
                        class="new-message__search__input"
                        type="text"
                        name="search"
                        id="search"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div class="new-message__options">
                {Object.entries(filteredItems).map(([key, val]) => {
                    return <>{val.map(item => <p onClick={() => addToSelected({gid: item.gid, title: item.title})}>{key}{item.title}</p>)}</>
                })}
            </div>
        </div>
    )
}