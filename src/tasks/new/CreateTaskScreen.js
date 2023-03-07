import { useEffect, useRef, useState } from "react"
import "./CreateTaskScreen.css"

export default function CreateTaskScreen() {
    const sessionToken = sessionStorage.getItem("session_token")
    const [task, setTask] = useState({})
    const [selectedType, setSelectedType] = useState("Sales")
    const [selectedTopic, setSelectedTopic] = useState("Return")
    const [customer, setCustomer] = useState({})
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [productType, setProductType] = useState("")
    const [filteredOrders, setFilteredOrders] = useState([])
    const [order, setOrder] = useState({
        type: "draft"
    })
    const [search, setSearch] = useState("")
    const [productSearch, setProductSearch] = useState("")
    const [searchFocused, setSearchFocued] = useState(false)
    const searchInput = useRef(null)
    const taskTypes = [
        "Sales",
        "Customer Service",
        "Accounting"
    ]
    const topicMap = {
        "Sales": [
            "Lead",
            "Follow-up"
        ],
        "Customer Service": [
            "Return",
            "Damage",
            "Shipping",
            "Question",
            "Tracking"
        ],
        "Accounting": [
            "Chargeback",
            "Capture"
        ]
    }
    useEffect(() => {
        if (orders && orders.length > 0) {
            setFilteredOrders(orders.filter(o => o.name.includes(search)))
        }
    }, [search])
    useEffect(() => {
        fetch("https://api.fpdash.com/products?fields=title,gid,img_src", {
            headers: {
                Authorization: sessionToken
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setProducts(res.products)
            }
        })
        fetch("https://api.fpdash.com/draftOrders/all?fields=name,admin_graphql_api_id").then(res => res.json()).then(res => {
            setOrders([...res.orders].reverse())
            setFilteredOrders([...res.orders].reverse())
        })
    }, [])
    const handleOrderChange = (selectedOrder) => {
        setOrder({
            ...selectedOrder
        })
    }
    const handleCustomerChange = ({ target }) => {
        setCustomer({
            ...customer,
            [target.name]: target.value
        })
    }
    return (
        <div className="new-task">
            <style>{`
                .content {
                    background-color: #fafafa;
                }
            `}</style>
            <h2 className="new-message__heading">Create Task</h2>
            <div className="new-task__row">
                <form className="new-task__form">
                    <div className="new-task__block">
                        <h3 className="new-task__form__heading">Task Settings</h3>
                        <div className="new-task__form__row">
                            <div className="new-task__form__group">
                                <label className="new-task__form__label" htmlFor="task_type">TYPE</label>
                                <select 
                                    className="new-task__form__input" 
                                    id="task_type" 
                                    name="task_type" 
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {taskTypes.map(t => <option value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="new-task__form__group">
                                <label className="new-task__form__label" htmlFor="task_topic">TOPIC</label>
                                <select 
                                    className="new-task__form__input" 
                                    id="task_topic" 
                                    name="task_topic" 
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                >
                                    {topicMap[selectedType].map(t => <option value={t}>{t}</option>)}
                                </select>
                            </div>
                            {order && order.type === "draft" 
                                ? 
                                    (
                                        <div className="new-task__form__group">
                                            <label className="new-task__form__label" htmlFor="task_draft_order_name">DRAFT NUMBER</label>
                                            <input 
                                                className="new-task__form__input" 
                                                type="text"
                                                id="task_draft_order_name" 
                                                name="task_draft_order_name" 
                                                value={order.name}
                                            />
                                        </div>
                                    )
                                :
                                    (
                                        <div className="new-task__form__group">
                                            <label className="new-task__form__label" htmlFor="task_order_name">PO NUMBER</label>
                                            <input 
                                                className="new-task__form__input" 
                                                type="text"
                                                id="task_order_name" 
                                                name="task_order_name" 
                                                value={order.name}
                                            />
                                        </div>
                                    )
                            }
                        </div>
                        <div style={{marginTop: '16px'}} className="new-task__form__row">
                            <div className="new-task__form__group">
                                <label className="new-task__form__label" htmlFor="task_assign">Assigned To</label>
                                <input 
                                    className="new-task__form__input" 
                                    type="text"
                                    id="task_assign" 
                                    name="task_assign" 
                                    value={"Geoff Jarman"}
                                />
                            </div>
                            <div className="new-task__form__group">
                                <label className="new-task__form__label" htmlFor="task_priority">Priority</label>
                                <select 
                                    className="new-task__form__input" 
                                    id="task_priority" 
                                    name="task_priority" 
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {taskTypes.map(t => <option value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="new-task__form__checkbox-container">
                                <input 
                                    className="new-task__form__checkbox" 
                                    type="checkbox"
                                    id="task_assign" 
                                    name="task_assign" 
                                    value={true}
                                />
                                <label className="new-task__form__checkbox-label" htmlFor="task_escalated">Escalated</label>
                            </div>
                        </div>
                    </div>
                    <div className="new-task__block">
                        <h3 className="new-task__form__heading" style={{width: 'fit-content'}}>Customer Information</h3>
                        <div className="new-task__form__customer">
                            <div className="new-task__form__row">
                                <div className="new-task__form__row">
                                    <div className="new-task__form__group">
                                        <label 
                                            className="new-task__form__label"
                                            htmlFor="customer_first_name"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="new-task__form__input"
                                            id="customer_first_name"
                                            name="customer_first_name"
                                            value={customer.firstName}
                                            onChange={handleCustomerChange}
                                        />
                                    </div>
                                    <div className="new-task__form__group">
                                        <label 
                                            className="new-task__form__label"
                                            htmlFor="customer_last_name"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="new-task__form__input"
                                            id="customer_last_name"
                                            name="customer_last_name"
                                            value={customer.lastName}
                                            onChange={handleCustomerChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="new-task__form__row">
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="new-task__form__input"
                                        id="customer_email"
                                        name="customer_email"
                                        value={customer.email}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                            </div>
                            <div className="new-task__form__row">
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        className="new-task__form__input"
                                        id="customer_company"
                                        name="customer_company"
                                        value={customer.company}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                            </div>
                            <div className="new-task__form__row">
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        className="new-task__form__input"
                                        id="customer_address"
                                        name="customer_address"
                                        value={customer.address}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                            </div>
                            <div className="new-task__form__row">
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        className="new-task__form__input"
                                        id="customer_city"
                                        name="customer_city"
                                        value={customer.city}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        State
                                    </label>
                                    <select className="new-task__form__input">
                                        <option value="STATE">STATE</option>
                                    </select>
                                </div>
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        Zip
                                    </label>
                                    <input
                                        type="text"
                                        className="new-task__form__input"
                                        id="customer_zip"
                                        name="customer_zip"
                                        value={customer.zip}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                            </div>
                            <div className="new-task__form__row">
                                <div className="new-task__form__group">
                                    <label 
                                        className="new-task__form__label"
                                        htmlFor="customer_company"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        className="new-task__form__input"
                                        id="customer_phone"
                                        name="customer_phone"
                                        value={customer.phone}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="new-task__products new-task__block">
                    <h3 className="new-task__form__heading" style={{width: 'fit-content', margin: '0 0 16px'}}>Products</h3>
                    <div className="new-task__product__search__container">
                        <div className="new-task__product__search__row">
                            <select className="new-task__product__select" value={productType}>
                                <option value="">Type</option>
                            </select>
                            <label style={{width: 0, height: 0, overflow: 'hidden', zIndex: -10}} htmlFor="product_search">
                                Search Products
                            </label>
                            <input
                                type="text"
                                id="product_search"
                                name="product_search"
                                className="new-task__product__search"
                                placeholder="Search Products"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                        </div>
                        {products.map(p => <p>{p.title}</p>)}
                    </div>
                </div>
            </div>
            <div className="new-task__row">
                <div className="new-task__order-notes new-task__block">
                    <h3 className="new-task__form__heading">Order Notes</h3>
                    <textarea

                    ></textarea>
                </div>
                <div className="new-task__task-notes new-task__block">
                    <h3 className="new-task__form__heading">Task Notes</h3>
                    <textarea

                    ></textarea>
                </div>
            </div>
            <button className="new-task__create">Create Task</button>
        </div>
    )
}