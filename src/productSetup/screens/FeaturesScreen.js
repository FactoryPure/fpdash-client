import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const [featureText, setFeatureText] = useState("")
    const { features } = useSelector(state => state).sections
    const handleChange = ({ target }) => {
        setFeatureText(target.value)
        const values = target.value.split("\n")
        const currentFeatures = values.map(v => v.trim()).filter(v => v.length)
        dispatch(setSections({features: currentFeatures}))
    }
    const addBold = () => {
        const ta = document.querySelector("textarea")
        const start = ta.selectionStart
        const end = ta.selectionEnd
        if (start !== end) {
            const substring = ta.value.substring(start, end)
            let taVal = ta.value
            taVal = taVal.replace(substring, `<strong>${substring}</strong>`)
            setFeatureText(taVal)
            const values = taVal.split("\n")
            const currentFeatures = values.map(v => v.trim()).filter(v => v.length)
            dispatch(setSections({features: currentFeatures}))
        }
    }
    useEffect(() => {
        if (features) {
            setFeatureText(features.join("\n"))
        }
    }, [])
    return (
        <>
            <p style={{textAlign: 'center', marginBottom: '16px'}}>Each feature must be separated by a newline (enter key). To add bold text, highlight the text and then press the &apos;B&apos; button</p>
            <button style={{marginBottom: '16px'}} onClick={addBold}>B</button>
            <textarea 
                spellCheck="true"
                onChange={handleChange}
                value={featureText}
            ></textarea>
            {(features && features.length > 0) && (
                <div className="description-preview description-preview--full">
                    <div className="pdp__features__row">
                        <div className="pdp__features__left">
                            <ul className="pdp__features__left__list">
                                {features.slice(0, Math.ceil(features.length / 2)).map(f => (
                                    <li dangerouslySetInnerHTML={{__html: f}}></li>
                                ))}
                            </ul>
                        </div>
                        <div className="pdp__features__right">
                            <ul className="pdp__features__right__list">
                                {features.slice(Math.ceil(features.length / 2)).map(f => (
                                    <li dangerouslySetInnerHTML={{__html: f}}></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}