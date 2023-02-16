import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const [packageText, setPackageText] = useState("")
    const { packageContents } = useSelector(state => state).sections
    const handleChange = ({ target }) => {
        setPackageText(target.value)
        const values = target.value.split("\n")
        const currentPackageContents = values.map(v => v.trim()).filter(v => v.length)
        dispatch(setSections({packageContents: currentPackageContents}))
    }
    useEffect(() => {
        if (packageContents) {
            setPackageText(packageContents.join("\n"))
        }
    }, [])
    return (
        <>
            <p style={{textAlign: 'center', marginBottom: '16px'}}>Each item must be separated by a newline (enter key)</p>
            <textarea 
                spellCheck="true"
                onChange={handleChange}
                value={packageText}
            ></textarea>
            {(packageContents && packageContents.length > 0) && (
                <div className="description-preview description-preivew--half">
                    <div className="pdp__specs__row__right__package">
                        <h3 className="pdp__specs__row__right__package__heading">Package Contents</h3>
                        <div className="pdp__specs__row__right__package__container">
                            {packageContents.map(p => <p className="pdp__specs__row__right__package__text">{p}</p>)}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}