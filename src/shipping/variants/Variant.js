export default function Variant({ variant, setFocus }) {
    return (
        <div onClick={() => setFocus(variant)} className="products__product">
            <p className="products__product__title">{`${variant.product_title} / ${variant.title} / ${variant.sku}`}</p>
            <div className="products__product__active">
                <p className="products__product__active__main-heading">{variant.activeMessage.message_id}</p>
                <div class="products__product__active__row">
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">PDP</p>
                        <p>{variant.activeMessage.pdp_line_1}</p>
                        <p>{variant.activeMessage.pdp_line_2}</p>
                    </div>
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">CART</p>
                        <p>{variant.activeMessage.cart_line_1}</p>
                        <p>{variant.activeMessage.cart_line_2}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}