import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const { description } = useSelector(state => state).sections
    const handleChange = ({ target }) => {
        const goLower = (el) => {
            let fontWeight = ''
            if (el.style.fontWeight && el.style.fontWeight !== "400") {
                fontWeight = el.style.fontWeight
            }
            el.removeAttribute("style")
            el.removeAttribute("class")
            if (fontWeight) el.style.fontWeight = fontWeight
            if (el.children.length > 0) {
                Array.from(el.children).forEach(child => goLower(child))
            }
        }
        Array.from(target.children).forEach(child => goLower(child))
        dispatch(setSections({description: target.innerHTML}))
    }
    useEffect(() => {
        if (description) {
            document.querySelector(".richtext").innerHTML = description
        }
    }, [])
    return (
        <>
            <p style={{textAlign: 'center', marginBottom: '16px'}}>This is the product overview section.<br/>You can paste text and HTML / images copied from websites into the box below.</p>
            <div className="richtext" contentEditable="true" onInput={handleChange}></div>
            {description && (
                <div className="description-preview description-preview--full">
                    <div className="pdp__description__heading">PRODUCT OVERVIEW</div>
                    <div className="pdp__description__left" dangerouslySetInnerHTML={{__html: description}}></div>
                </div>
            )
            }
        </>
    )
}