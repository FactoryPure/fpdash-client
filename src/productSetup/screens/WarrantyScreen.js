import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const { warranty } = useSelector(state => state).sections
    const handleChange = ({ target }) => {
        dispatch(setSections({warranty: target.value}))
    }
    return (
        <>
            <p style={{textAlign: 'center', marginBottom: '16px'}}>Enter the warranty text below. Warranty text cannot contain any newlines.</p>
            <textarea 
                spellCheck="true"
                value={warranty}
                onChange={handleChange}
            ></textarea>
            {(warranty && warranty !== "N/A") && (
                <div className="description-preview">
                    <div className="pdp__warranty__authorized">
                        <div className="pdp__warranty__authorized__row">
                        <div className="pdp__warranty__authorized__row__image-container">
                            <img className="pdp__warranty__authorized__row__image-container__img" src="https://cdn.vectorstock.com/i/1000x1000/06/00/vendor-rubber-stamp-vector-12410600.webp" alt="vendor logo" width="auto" height="auto" loading="lazy" />
                        </div>
                        <img className="pdp__warranty__authorized__row__divider" src="https://cdn.shopify.com/s/files/1/1163/1976/files/warranty-line.png?v=1605396259" alt="divider" width="2" height="auto" loading="lazy" />
                        <div className="pdp__warranty__authorized__row__image-container">
                            <img className="pdp__warranty__authorized__row__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/authorized-dealer-stacked.png?v=1605396129" alt="authorized dealer" width="auto" height="auto" loading="lazy" />
                        </div>
                    </div>
                        <p id="warranty">{warranty}</p>
                    </div>
                </div>
            )}
        </>
    )
}