export default function Product({ product, setFocus }) {
    return (
        <div onClick={() => setFocus(product)} className="products__product">
            <p className="products__product__title">{product.title}</p>
            <div className="products__product__active">
                <p className="products__product__active__main-heading">{product.activeMessage.message_id}</p>
                <div class="products__product__active__row">
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">PDP</p>
                        <p>{product.activeMessage.pdp_line_1}</p>
                        <p>{product.activeMessage.pdp_line_2}</p>
                    </div>
                    <div className="products__product__active__item">
                        <p class="products__product__active__heading">CART</p>
                        <p>{product.activeMessage.cart_line_1}</p>
                        <p>{product.activeMessage.cart_line_2}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}