import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ManualView from "../components/ManualView"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const { manuals } = useSelector(state => state).sections
    const [currentManuals, setCurrentManuals] = useState(manuals)
    const handleChange = ({ target }) => {
        dispatch(setSections({manuals: target.value}))
    }
    const handleSave = (manual, index) => {
        const newManuals = [...currentManuals]
        newManuals.splice(index, 1, manual)
        setCurrentManuals(newManuals)
    }
    const handleRemove = (index) => {
        const newManuals = [...currentManuals]
        newManuals.splice(index, 1)
        setCurrentManuals(newManuals)
    }
    const addManual = () => {
        setCurrentManuals([
            ...currentManuals,
            { name: '', href: '' }
        ])
    }
    useEffect(() => {
        dispatch(setSections({manuals: currentManuals}))
    }, [currentManuals])
    return (
        <>
            {manuals && manuals.map((m, index) => <ManualView name={m.name} href={m.href} index={index} handleSave={handleSave} handleRemove={handleRemove} />)}
            <button onClick={addManual}>Add Manual</button>
            {(manuals && manuals.length > 0) && (
                <div className="description-preview description-preview--full">
                    <div className="pdp__manuals__grid">
                        {manuals.map(m => (
                            <a className="pdp__manuals__grid__manual" href={m.href} target="_blank" rel="noreferrer">
                                <div className="pdp__manuals__grid__manual__image-container">
                                    <img className="pdp__manuals__grid__manual__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/pdf-icon.png?v=1611684687" alt="manual icon" width="auto" height="auto" loading="lazy" />
                                </div>
                                <p className="pdp__manuals__grid__manual__text">{m.name}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}