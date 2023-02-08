import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getData } from "../redux/data"
import { getSelected, setSelected } from "../redux/selected"
import { getUser } from "../redux/user"

export default function Modal() {
    const { user, selected } = useSelector(state => state)
    const [mode, setMode] = useState(selected ? selected.mode : "default")
    const initForm = {
        message_id: "",
        end_date: "",
        pdp_line_1: "",
        pdp_line_2: "",
        cart_line_1: "",
        cart_line_2: "",
    }
    const [formData, setFormData] = useState(selected ? selected : initForm)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const gids = selected.gids ? selected.gids : [selected.gid]

        fetch("https://webdevclothing.com/shipping", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gids,
                ...formData,
                email: user.email,
                table: selected.type && selected.type.toLowerCase() === "product" ? "skus" : "brands",
                override: mode === "override"
            })
        })
        .then(() => {
            setFormData(initForm)
            setMode("default")
            dispatch(setSelected(null))
            navigate("/all")
        })
        // .then(res => res.json())
        // .then(console.log)
        .catch(console.log)
        
    }
    useEffect(() => {
        if (selected) {
            setFormData({
                ...formData,
                mode,
                pdp_line_1: mode === "override" 
                    ? selected.or_pdp_line_1 ? selected.or_pdp_line_1 : ""
                    : selected.pdp_line_1 ? selected.pdp_line_1 : "",
                pdp_line_2: mode === "override" 
                    ? selected.or_pdp_line_2 ? selected.or_pdp_line_2 : "" 
                    : selected.pdp_line_2 ? selected.pdp_line_2 : "",
                cart_line_1: mode === "override" 
                    ? selected.or_cart_line_1 ? selected.or_cart_line_1  : ""
                    : selected.cart_line_1 ? selected.cart_line_1 : "",
                cart_line_2: mode === "override" 
                    ? selected.or_cart_line_2 ? selected.or_cart_line_2  : ""
                    : selected.cart_line_2 ? selected.cart_line_2 : "",
                end_date: mode === "override" 
                    ? selected.or_end_date ? selected.or_end_date : ""
                    : selected.end_date ? selected.end_date : "",
                message_id: mode === "override" 
                    ? selected.or_message_id ? selected.or_message_id : random
                    : selected.message_id ? selected.message_id : random
            })
        }
    }, [mode, selected])
    const random = String(Math.floor(Date.now()))
    return (
        <div className={selected ? 'modal modal--visible' : 'modal'}>
            {selected && (
                <div className="modal__inner">
                    <div className="modal__close" onClick={() => dispatch(setSelected(null))}>&times;</div>
                    <h2 className="modal__title">{selected.title}</h2>
                    <form className="modal__form" onSubmit={handleSubmit}>
                        <div className="modal__form__row">
                            <p class="modal__form__type">{selected.type}</p>
                        </div>
                        <div className="modal__form__row modal__form__row--flex">
                            <div class="modal__form__row--half">
                                <label htmlFor="message_id">Message ID</label>
                                <input 
                                    id="message_id"
                                    name="message_id"
                                    value={formData.message_id}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div class="modal__form__row--half">
                                <label htmlFor="end_date">End Date</label>
                                <input 
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    type="date"
                                />
                            </div>
                            <div class="modal__form__row--half">
                                <label htmlFor="override">Mode</label>
                                <select class="modal__form__override" id="mode" name="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="override">Override</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="pdp_line_1">PDP Line 1</label>
                            <input 
                                id="pdp_line_1"
                                name="pdp_line_1"
                                value={formData.pdp_line_1}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="pdp_line_2">PDP Line 2</label>
                            <input 
                                id="pdp_line_2"
                                name="pdp_line_2"
                                value={formData.pdp_line_2}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="cart_line_1">Cart Line 1</label>
                            <input 
                                id="cart_line_1"
                                name="cart_line_1"
                                value={formData.cart_line_1}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="cart_line_2">Cart Line 2</label>
                            <input 
                                id="cart_line_2"
                                name="cart_line_2"
                                value={formData.cart_line_2}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <button className="modal__form__submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    )
}