import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PlugView from "../components/PlugView"
import { setSections } from "../../redux/sections"

export default function PreviewScreen() {
    const { sections } = useSelector(state => state)
    const [successfulUpload, setSuccessfulUpload] = useState("pending")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleSubmit = () => {
        setLoading(true)
        fetch("http://localhost:8080/descriptions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sections)
        }).then(res => res.json()).then((res) => {
            setLoading(false)
            fetch("http://localhost:8080/descriptions/toggle", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gid: sections.product.gid,
                    version: "new"
                })
            }).then(res => res.json()).then(console.log).catch(console.log)
            if (res.success) {
                setSuccessfulUpload("true")
                dispatch(setSections({
                    product: "",
                    description: "",
                    checkmarks: [],
                    plugs: [],
                    features: [],
                    specifications: { left: [], right: [] },
                    packageContents: [],
                    warranty: "",
                    manuals: [],
                    crossSells: []
                }))
            } else {
                setSuccessfulUpload("false")
            }
        }).catch(console.log)
    }
    return (
        <>
        {sections.product && <h2 style={{marginBottom: "32px"}}>Please review this page then submit at the bottom.</h2>}
        <div id="product-content" className="js-product-wrapper">
            <style>{`
                body {
                    background-color: #EEEEEE;
                }
            `}</style>
            {sections.description.length > 0 && <section className="pdp__description">
                <div id="overview-section" className="pdp__hidden-anchor"></div>
                <div className="pdp__description__wrapper">
                    <h2 className="pdp__description__heading">Product Overview</h2>
                    <div className="pdp__description__accordion js-accordion">
                        <div className="pdp__description__content-row">
                            <div className="pdp__description__left" dangerouslySetInnerHTML={{__html: sections.description}}></div>
                            <div className="pdp__description__right">
                                <div className="pdp__description__authorized-row">
                                    <div className="pdp__description__authorized-row__image-container">
                                        <img className="pdp__description__authorized-row__image-container__img" src="https://cdn.vectorstock.com/i/1000x1000/06/00/vendor-rubber-stamp-vector-12410600.webp" alt="vendor logo" width="auto" height="auto" loading="lazy" />
                                    </div>
                                    <img className="pdp__description__authorized-row__divider" src="https://cdn.shopify.com/s/files/1/1163/1976/files/warranty-line.png?v=1605396259" alt="divider" width="2" height="auto" loading="lazy" />
                                    <div className="pdp__description__authorized-row__image-container">
                                        <img className="pdp__description__authorized-row__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/authorized-dealer-stacked.png?v=1605396129" alt="authorized dealer" width="auto" height="auto" loading="lazy" />
                                    </div>
                                </div>
                                <div className="pdp__description__checkmarks">
                                    {sections.checkmarks && sections.checkmarks.map(c => (
                                        <div className="pdp__description__checkmarks__row">
                                            <div className="pdp__description__checkmarks__row__image-container">
                                                <img className="pdp__description__checkmarks__row__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/checkmark.svg?v=1604691291" alt="checkmark" width="auto" height="auto" loading="lazy" />
                                            </div>
                                            <p className="pdp__description__checkmarks__row__text">{c}</p>
                                        </div>
                                    ))} 
                                </div>
                                {sections.plugs.length > 0 && <div className="pdp__description__plugs pdp__description__plugs--desktop">
                                    <h2 className="pdp__description__plugs__heading">Plug Types</h2>
                                    {sections.plugs.map(p => <PlugView name={p.name} amount={p.amount} />)}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>}
            {sections.features.length > 0 && <section className="pdp__features">
                <div id="features-section" className="pdp__hidden-anchor"></div>
                    <div className="pdp__features__wrapper">
                        <h2 className="pdp__features__heading">Features</h2>
                        <div className="pdp__features__accordion js-accordion">
                        <div className="pdp__features__row">
                            <div className="pdp__features__left">
                                <ul className="pdp__features__left__list">
                                    {sections.features.slice(0, Math.ceil(sections.features.length / 2)).map(f => (
                                        <li dangerouslySetInnerHTML={{__html: f}}></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pdp__features__right">
                                <ul className="pdp__features__right__list">
                                    {sections.features.slice(Math.ceil(sections.features.length / 2)).map(f => (
                                        <li dangerouslySetInnerHTML={{__html: f}}></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>}
            {(sections.specifications.left.length > 0 || 
                sections.specifications.right.length > 0 || 
                sections.packageContents.length > 0) && <section className="pdd__specs">
                <div id="specifications-section" className="pdp__hidden-anchor"></div>
                <div className="pdp__specs__wrapper">
                    <h2 className="pdp__specs__heading">Specifications</h2>
                    <div className="pdp__specs__accordion js-accordion">
                        <div className="pdp__specs__row">
                            {sections.specifications.left.length > 0 && <div className="pdp__specs__row__left">
                                <table className="pdp__specs__row__left__table">
                                    <tbody className="pdp__specs__row__left__table__tbody">
                                        {sections.specifications.left && sections.specifications.left.map(s => {
                                            const cells = s.split(":")
                                            let heading = false
                                            if (cells.length === 1) {
                                                cells.push("")
                                                heading = true
                                            }
                                            return (
                                                <tr>
                                                    <td className={heading ? "pdp__specs__row--bold pdp__specs__row--green" : "pdp__specs__row--bold"}>
                                                        {cells[0]}
                                                    </td>
                                                    <td>
                                                        {cells[1]}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>}
                            {(sections.specifications.right.length > 0 || sections.packageContents.length > 0) && <div className="pdp__specs__row__right">
                                {sections.specifications.right.length > 0 && <table className="pdp__specs__row__right__table">
                                    <tbody className="pdp__specs__row__right__table__tbody">
                                        {sections.specifications.right && sections.specifications.right.map(s => {
                                            const cells = s.split(":")
                                            let heading = false
                                            if (cells.length === 1) {
                                                cells.push("")
                                                heading = true
                                            }
                                            return (
                                                <tr>
                                                    <td className={heading ? "pdp__specs__row--bold pdp__specs__row--green" : "pdp__specs__row--bold"}>
                                                        {cells[0]}
                                                    </td>
                                                    <td>
                                                        {cells[1]}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>}
                                <div className="pdp__specs__row__right__package">
                                    <h3 className="pdp__specs__row__right__package__heading">Package Contents</h3>
                                    <div className="pdp__specs__row__right__package__container">
                                        {sections.packageContents && sections.packageContents.map(p => <p className="pdp__specs__row__right__package__text">{p}</p>)}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </section>}
            {(sections.warranty && sections.warranty !== "N/A") && (
                <section className="pdp__warranty">
                    <div id="warranty-section" className="pdp__hidden-anchor"></div>
                    <div className="pdp__warranty__wrapper">
                        <h2 className="pdp__warranty__heading">Warranty</h2>
                        <div className="pdp__warranty__accordion js-accordion">
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
                                <p id="warranty">{sections.warranty}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {sections.manuals.length > 0 && <section className="pdp__manuals">
                <div id="manuals-section" className="pdp__hidden-anchor"></div>
                <div className="pdp__manuals__wrapper">
                    <h2 className="pdp__manuals__heading">Manuals &amp; Documentation</h2>
                    <div className="pdp__manuals__accordion js-accordion">
                        <div className="pdp__manuals__grid">
                            {sections.manuals.map(m => (
                                <a className="pdp__manuals__grid__manual" href={m.href} target="_blank" rel="noreferrer">
                                    <div className="pdp__manuals__grid__manual__image-container">
                                        <img className="pdp__manuals__grid__manual__image-container__img" src="https://cdn.shopify.com/s/files/1/1163/1976/files/pdf-icon.png?v=1611684687" alt="manual icon" width="auto" height="auto" loading="lazy" />
                                    </div>
                                    <p className="pdp__manuals__grid__manual__text">{m.name}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>}
        </div>
        {successfulUpload === "pending" ? <h2 style={{marginBottom: '16px', marginTop: '32px'}}>Looks good?</h2> : successfulUpload === "true" ? <h2 style={{marginBottom: '16px', marginTop: '32px'}}>Successfully Updated Product!</h2> : <h2 style={{marginBottom: '16px', marginTop: '32px'}}>Updated failed</h2>}
            {loading && (
                <svg style={{width: '100px', height: '100px'}} version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 100 100" enable-background="new 0 0 100 100">
                    <circle fill="none" stroke="orange" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="48"/>
                    <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
                    <animateTransform 
                        attributeName="transform" 
                        dur="2s"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite" />
                    </line>
                    <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
                    <animateTransform 
                        attributeName="transform" 
                        dur="15s"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite" />
                    </line>
                </svg>
            )
            }
        <button onClick={handleSubmit}>SUBMIT</button>
        </>
    )
}