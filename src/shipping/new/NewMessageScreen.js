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
    const [bulk, setBulk] = useState("")
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
    const debouncedBulk = useDebounce(bulk, 500)
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
    useEffect(() => {
        const values = debouncedBulk.split(",").map(v => v.toLowerCase().trim())
        const valueMap = {}
        for (let val of values) {
            valueMap[val] = 1
        }
        const matchingProducts = items.products.filter(p => valueMap[p.title.toLowerCase()] || (p.sku && valueMap[p.sku.toLowerCase()]) || valueMap[p.gid.split("/")[4]]).map(p => { return { ...p, type: 'products' } })
        const matchingVariants = items.variants.filter(p => valueMap[p.sku.toLowerCase()]).map(v => { return { ...v, type: 'variants' } })
        const matchingCollections = items.brands.filter(p => valueMap[p.title.toLowerCase()]).map(c => { return { ...c, type: 'brands' } })
        const toAdd = [...matchingProducts, ...matchingVariants, ...matchingCollections]
        setSelectedItems(toAdd)
    }, [debouncedBulk])
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
        } else if (item.title.toLowerCase().includes(debouncedSearch)) {
            return true
        } else if (item.product_title && item.product_title.toLowerCase().includes(debouncedSearch)) {
            return true
        } else if (item.sku && item.sku.toLowerCase() === debouncedSearch) {
            return true
        }
        return false
    }
    useEffect(() => {
        const fetchAndSet = async () => {
            const promises = [
                fetch("https://api.fpdash.com/collections?brands=true", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionToken
                    }
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        tempItems.brands = res.collections
                    }
                }),
                fetch("https://api.fpdash.com/products", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionToken
                    }
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        tempItems.products = res.products
                    }
                }),
                fetch("https://api.fpdash.com/variants", {
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
    const handleBulkChange = ({ target }) => {
        setBulk(target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("https://api.fpdash.com/shipping", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionToken
            },
            body: JSON.stringify({
                gids: selectedItems.map(s => s.gid), 
                pdp_line_1: e.target.pdp_line_1.value, 
                pdp_line_2: e.target.pdp_line_2.value, 
                cart_line_1: e.target.cart_line_1.value, 
                cart_line_2: e.target.cart_line_2.value, 
                message_id: e.target.message_id.value, 
                end_date: e.target.end_date.value
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                navigate("/shipping/messages")
            } else {
                alert(res.message)
            }
        })
    }
    return (
        <div className="new-message">
            <h2 className="new-message__heading">New Message</h2>
            <div className="new-message__row">
                <form className="new-message__form" onSubmit={handleSubmit}>
                    <div className="new-message__row">
                        <div className="new-message__group">
                            <label for="message_id" className="new-message__label">
                                Message ID
                            </label>
                            <input 
                                className="new-message__input"
                                type="text"
                                name="message_id"
                                id="message_id"
                                value={message.message_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="new-message__group">
                            <label for="end_date" className="new-message__label">
                                End Date
                            </label>
                            <input 
                                className="new-message__input"
                                type="date" 
                                name="end_date"
                                id="end_date"
                                value={message.end_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="new-message__row">
                        <div className="new-message__group">
                            <label for="pdp_line_1" className="new-message__label">
                                PDP Line 1
                            </label>
                            <input 
                                className="new-message__input"
                                type="text"
                                name="pdp_line_1"
                                id="pdp_line_1"
                                value={message.pdp_line_1}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="new-message__row">
                        <div className="new-message__group">
                            <label for="pdp_line_2" className="new-message__label">
                                PDP Line 2
                            </label>
                            <input 
                                className="new-message__input"
                                type="text"
                                name="pdp_line_2"
                                id="pdp_line_2"
                                value={message.pdp_line_2}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="new-message__row">
                        <div className="new-message__group">
                            <label for="cart_line_1" className="new-message__label">
                                Cart Line 1
                            </label>
                            <input 
                                className="new-message__input"
                                type="text"
                                name="cart_line_1"
                                id="cart_line_1"
                                value={message.cart_line_1}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="new-message__row">
                        <div className="new-message__group">
                            <label for="cart_line_2" className="new-message__label">
                                Cart Line 2
                            </label>
                            <input 
                                className="new-message__input"
                                type="text"
                                name="cart_line_2"
                                id="cart_line_2"
                                value={message.cart_line_2}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button className="new-message__submit">CREATE</button>
                </form>
                <div className="new-message__selected">
                    {selectedItems.map(item => {
                        const classValue = item.type === "products" ? 'new-message__option new-message__option--product' : item.type === "brands" ? 'new-message__option new-message__option--brand' : 'new-message__option new-message__option--variants' 
                        return (
                            <div className={classValue} onClick={() => removeFromSelected(item)}>
                                <p className="new-message__option__type">{item.type}</p>
                                <p className="new-message__option__title">{item.product_title ? `${item.product_title} - ${item.title} - ${item.sku}` : item.title}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div style={{marginTop: '16px'}} className="new-message__row">
                <div className="new-message__filter">
                    <div className="new-message__search-heading-row">
                        <p className="new-message__search-heading">Applies to</p>
                        <div className="new-message__search">
                            <select className="new-message__search__type" value={broadFilter} onChange={(e) => setBroadFilter(e.target.value)}>
                                <option value="all">All</option>
                                <option value="products">Products</option>
                                <option value="variants">Variants</option>
                                <option value="brands">Brands</option>
                            </select>
                            <input 
                                className="new-message__search__input"
                                type="text"
                                name="search"
                                id="search"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className="new-message__options">
                        {Object.entries(filteredItems).map(([key, val]) => {
                            return <>
                                {val.map(item => {
                                    const classValue = key === "products" ? 'new-message__option new-message__option--product' : key === "brands" ? 'new-message__option new-message__option--brand' : 'new-message__option new-message__option--variants' 
                                    return (
                                        <div className={classValue} onClick={() => addToSelected({type: key, gid: item.gid, title: item.title, sku: item.sku, product_title: item.product_title})}>
                                            <p className="new-message__option__type">{key}</p>
                                            <p className="new-message__option__title">{item.product_title ? `${item.product_title} - ${item.title} - ${item.sku}` : item.title}</p>
                                        </div>
                                    )
                                })}
                            </>
                        })}
                    </div>
                </div>
                <textarea
                    className="new-message__bulk"
                    id="bulk_add"
                    name="bulk_add"
                    placeholder="Bulk add (comma separated skus, titles, or ids)"
                    value={bulk}
                    onChange={handleBulkChange}
                ></textarea>
            </div>
        </div>
    )
}