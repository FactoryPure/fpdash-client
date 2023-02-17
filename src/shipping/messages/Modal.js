import { useEffect, useState } from "react"

export default function Modal({ focus, setFocus, setNeedsRefresh }) {
    const [focusClone, setFocusClone] = useState({...focus})
    const [showModal, setShowModal] = useState(false) 
    const [isEditted, setIsEditted] = useState(false)
    const [selectedItems, setSelectedItems] = useState(focus && focus.activeOn ? [...focus.activeOn] : [])
    useEffect(() => {
        setFocusClone({...focus})
        setSelectedItems(focus && focus.activeOn ? [...focus.activeOn] : [])
    }, [focus])
    const sessionToken = sessionStorage.getItem("session_token")
    const handleClose = () => {
        setIsEditted(false)
        setFocus({})
    }
    const handleDelete = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://api.fpdash.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionToken
                },
                body: JSON.stringify({
                    message_id: focus.message_id
                })
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    setFocus({})
                    setNeedsRefresh(true)
                    setIsEditted(false)
                } else {
                    alert(res.message)
                }
            })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("https://api.fpdash.com/shipping", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionToken
            },
            body: JSON.stringify({
                gids: selectedItems.map(item => item.gid),
                new_message_id: focusClone.message_id,
                pdp_line_1: focusClone.pdp_line_1,
                pdp_line_2: focusClone.pdp_line_2,
                cart_line_1: focusClone.cart_line_1,
                cart_line_2: focusClone.cart_line_2,
                end_date: focusClone.end_date,
                message_id: focus.message_id
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setFocus({})
                setNeedsRefresh(true)
                setIsEditted(false)
            } else {
                alert(res.message)
            }
        })
    }
    useEffect(() => {
        if (focus.message_id) {
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    }, [focus])
    const addToSelected = (item) => {
        setIsEditted(true)
        setSelectedItems([
            ...selectedItems.filter(s => s.gid !== item.gid),
            item
        ])
    }
    const removeFromSelected = (item) => {
        setIsEditted(true)
        setSelectedItems([
            ...selectedItems.filter(s => s.gid !== item.gid)
        ])
    }
    return (
        <>
            {showModal && 
                <div className="focus">
                    <div className="focus__inner">
                        <div className="new-message__row">
                            <Form focus={focusClone} setFocus={setFocusClone} isEditted={isEditted} setIsEditted={setIsEditted} />
                            <div className="new-message__selected">
                                {selectedItems && selectedItems.map(item => {
                                    const classValue = item.gid.includes("Product/") ? 'new-message__option new-message__option--product' : item.gid.includes("Collection/") ? 'new-message__option new-message__option--brand' : 'new-message__option new-message__option--variants' 
                                    const type = item.gid.includes("Product/") ? 'products' : item.gid.includes("Collection/") ? 'brands' : 'variants'
                                    return (
                                        <div className={classValue} onClick={() => removeFromSelected({type, ...item})}>
                                            <p className="new-message__option__type">{type}</p>
                                            <p className="new-message__option__title">{item.product_title ? `${item.product_title} - ${item.title} - ${item.sku}` : item.title}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="new-message__row">
                            <ProductList sessionToken={sessionToken} selectedItems={selectedItems} addToSelected={addToSelected} />
                        </div>
                        <div className="focus__buttons">
                            <button style={!isEditted ? {opacity: 0, display: 'none', pointerEvents: 'none'} : {}} className="focus__buttons__button" onClick={handleSubmit}>SAVE</button>
                            <button className="focus__buttons__button focus__buttons__button--delete" onClick={handleDelete}>DELETE</button>
                            <button className="focus__buttons__button focus__buttons__button--close" onClick={handleClose}>CLOSE</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const Form = ({ focus, setFocus, isEditted, setIsEditted }) => {
    const handleChange = ({ target }) => {
        if (!isEditted) {
            setIsEditted(true)
        }
        setFocus({
            ...focus,
            [target.name]: target.value
        })
    }
    return (
        <form className="new-message__form">
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
                        value={focus.message_id}
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
                        value={focus.end_date}
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
                        value={focus.pdp_line_1}
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
                        value={focus.pdp_line_2}
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
                        value={focus.cart_line_1}
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
                        value={focus.cart_line_2}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </form>
    )
}

const ProductList = ({ sessionToken, selectedItems, addToSelected }) => {
    const [search, setSearch] = useState("")
    const tempItems = {
        products: [],
        brands: [],
        variants: []
    }
    const [items, setItems] = useState({...tempItems})
    const [filteredItems, setFilteredItems] = useState({...tempItems})
    const [broadFilter, setBroadFilter] = useState("all")    
    const debouncedSearch = useDebounce(search, 200)
    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value)
        useEffect(
          () => {
            const handler = setTimeout(() => {
              setDebouncedValue(value.toLowerCase())
            }, delay)
            return () => {
              clearTimeout(handler)
            };
          },
          [value, delay]
        );
        return debouncedValue
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
            products: newItems.products.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid)).slice(0, 200),
            brands: newItems.brands.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid)).slice(0, 200),
            variants: newItems.variants.filter(item => isMatch(item, {...searchMap}) && !selectedItems.find(s => s.gid === item.gid)).slice(0, 200)
        })
    }, [debouncedSearch, broadFilter, selectedItems])
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
                setFilteredItems({
                    products: tempItems.products.slice(0, 200),
                    brands: tempItems.brands.slice(0, 200),
                    variants: tempItems.variants.slice(0, 200)
                })
            })
        }
        fetchAndSet()
    }, [])
    return (
        <div className="new-message__filter new-message__filter--full">
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
                    return <div key={key}>
                        {val.map((item, index) => {
                            const classValue = key === "products" ? 'new-message__option new-message__option--product' : key === "brands" ? 'new-message__option new-message__option--brand' : 'new-message__option new-message__option--variants' 
                            return (
                                <div key={item+index} className={classValue} onClick={() => addToSelected({type: key, gid: item.gid, title: item.title, sku: item.sku, product_title: item.product_title})}>
                                    <p className="new-message__option__type">{key}</p>
                                    <p className="new-message__option__title">{item.product_title ? `${item.product_title} - ${item.title} - ${item.sku}` : item.title}</p>
                                </div>
                            )
                        })}
                    </div>
                })}
            </div>
        </div>
    )
}