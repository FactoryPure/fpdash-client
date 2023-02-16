import { useEffect } from "react"

export default function Message({ message, setFocus }) {
    const handlePopup = () => {
        setFocus({...message})
    }
    const diff = 4000 * 60 * 60 * 24
    const now = Date.now()
    const current = new Date(message.end_date).getTime()
    const endColor = (current < now) ? 'shipping__messages__message__pdp__value--ended' : (current < (now - diff)) ? 'shipping__messages__message__pdp__value--soon' : ''
    return (
        <div className="shipping__messages__message" onClick={handlePopup}>
            <h2 className="shipping__messages__message__heading">{message.message_id}</h2>
            <div className="shipping__messages__message__pdp">
                <h3 className="shipping__messages__message__pdp__heading">PDP</h3>
                <p className="shipping__messages__message__pdp__value">{message.pdp_line_1}</p>
                <p className="shipping__messages__message__pdp__value">{message.pdp_line_2}</p>
            </div>
            <div className="shipping__messages__message__pdp">
                <h3 className="shipping__messages__message__pdp__heading">CART</h3>
                <p className="shipping__messages__message__pdp__value">{message.cart_line_1}</p>
                <p className="shipping__messages__message__pdp__value">{message.cart_line_2}</p>
            </div>
            <div className="shipping__messages__message__end">
                <h3 className="shipping__messages__message__end__heading">END DATE</h3>
                <p className={`shipping__messages__message__pdp__value ${endColor}`}>{message.end_date}</p>
            </div>
            <div classname="shipping__messages__message__activeon">
                <h3 className="shipping__messages__message__end__heading">APPLIED TO</h3>
                <p className="shipping__messages__message__pdp__value">{message.activeOn ? message.activeOn.length : 0} Item{(message.activeOn && message.activeOn.length !== 1) || !message.activeOn ? 's' : ''}</p>
            </div>
        </div>
    )
}