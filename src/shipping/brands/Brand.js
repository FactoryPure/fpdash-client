export default function Product({ brand, setFocus }) {
    return (
        <div onClick={() => setFocus(brand)} className="products__product">
            <p className="products__product__title">{brand.title}</p>
            <div className="products__product__active">
                <p className="products__product__active__main-heading">{brand.activeMessage.message_id}</p>
                <div class="products__product__active__row">
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">PDP</p>
                        <p>{brand.activeMessage.pdp_line_1}</p>
                        <p>{brand.activeMessage.pdp_line_2}</p>
                    </div>
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">CART</p>
                        <p>{brand.activeMessage.cart_line_1}</p>
                        <p>{brand.activeMessage.cart_line_2}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}