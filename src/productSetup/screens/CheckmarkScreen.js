import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const [checkText, setCheckText] = useState("")
    const { checkmarks } = useSelector(state => state).sections
    const handleChange = ({ target }) => {
        setCheckText(target.value)
        const values = target.value.split("\n")
        const currentCheckmarks = values.map(v => v.trim()).filter(v => v.length)
        dispatch(setSections({checkmarks: currentCheckmarks}))
    }
    useEffect(() => {
        if (checkmarks) {
            setCheckText(checkmarks.join("\n"))
        }
    }, [])
    return (
        <>
            <p style={{textAlign: 'center', marginBottom: '16px'}}>Each checkmark item must be separated by a newline (enter key)</p>
            <textarea 
                spellCheck="true"
                onChange={handleChange}
                value={checkText}
            ></textarea>
            {(checkmarks && checkmarks.length > 0) && <div className="description-preview">
                <div className="pdp__description__checkmarks">
                {checkmarks.map(c => (
                    <div className="pdp__description__checkmarks__row">
                        <div className="pdp__description__checkmarks__row__image-container">
                            <img className="pdp__description__checkmarks__row__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/checkmark.svg?v=1604691291" alt="checkmark" width="auto" height="auto" loading="lazy" />
                        </div>
                        <p className="pdp__description__checkmarks__row__text">{c}</p>
                    </div>
                ))}
                </div>
            </div>}
        </>
    )
}