import { useEffect, useState } from "react"

export default function Modal({ focus, setFocus, setNeedsRefresh }) {
    const [showModal, setShowModal] = useState(false) 
    const [isEditted, setIsEditted] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState("")
    const sessionToken = sessionStorage.getItem("session_token")
    const handleClose = () => {
        setIsEditted(false)
        setFocus({})
    }
    const handleDelete = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://api.fpdash.com/shipping/item", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionToken
                },
                body: JSON.stringify({
                    gid: focus.gid
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
        fetch("https://api.fpdash.com/shipping/item", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionToken
            },
            body: JSON.stringify({
                gid: focus.gid,
                active_message_id: selectedMessage
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
            setSelectedMessage(focus.activeMessage.message_id)
        } else {
            setShowModal(false)
            setSelectedMessage("")
        }
    }, [focus])
    const handleChangeMessage = ({ target }) => {
        setSelectedMessage(target.value)
        setIsEditted(true)
    }
    return (
        <>
            {
                showModal && (
                    <div className="focus">
                        <div className="focus__inner">
                            {focus.messages && (
                                <div className="products__product__message">
                                    <h2 className="products__product__message__product-title">{focus.product_title ? `${focus.product_title} / ${focus.title} / ${focus.sku}` : focus.title}</h2>
                                    <div className="products__product__message__row">
                                        <p className="products__product__message__select-heading">Active Message:</p>
                                        <select class="products__product__message__select" value={selectedMessage} onChange={handleChangeMessage}>
                                            {focus.messageOrder && focus.messageOrder.map(m => <option value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="products__product__message__row">
                                        <div className="products__product__message__group">
                                            <p className="products__product__message__group__heading">Message ID</p>
                                            <p className="products__product__message__group__value">{focus.messages[selectedMessage].message_id}</p>
                                        </div>
                                        <div className="products__product__message__group">
                                            <p className="products__product__message__group__heading">End Date</p>
                                            <p className="products__product__message__group__value">{focus.messages[selectedMessage].end_date}</p>
                                        </div>
                                    </div>
                                    <div className="products__product__message__group">
                                        <p className="products__product__message__group__heading">PDP Line 1</p>
                                        <p className="products__product__message__group__value">{focus.messages[selectedMessage].pdp_line_1}</p>
                                    </div>
                                    <div className="products__product__message__group">
                                        <p className="products__product__message__group__heading">PDP Line 2</p>
                                        <p className="products__product__message__group__value">{focus.messages[selectedMessage].pdp_line_2}</p>
                                    </div>
                                    <div className="products__product__message__group">
                                        <p className="products__product__message__group__heading">Cart Line 1</p>
                                        <p className="products__product__message__group__value">{focus.messages[selectedMessage].cart_line_1}</p>
                                    </div>
                                    <div className="products__product__message__group">
                                        <p className="products__product__message__group__heading">Cart Line 2</p>
                                        <p className="products__product__message__group__value">{focus.messages[selectedMessage].cart_line_2}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="focus__buttons">
                            <button style={!isEditted ? {opacity: 0, display: 'none', pointerEvents: 'none'} : {}} className="focus__buttons__button" onClick={handleSubmit}>SAVE</button>
                            <button className="focus__buttons__button focus__buttons__button--delete" onClick={handleDelete}>DELETE</button>
                            <button className="focus__buttons__button focus__buttons__button--close" onClick={handleClose}>CLOSE</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}