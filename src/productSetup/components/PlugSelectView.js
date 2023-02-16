import { useState } from "react"

export default function PlugSelectView({ name, amount, index, handleSave, handleRemove }) {
    const [editted, setEditted] = useState(false)
    const plugMap = {
        "5-20R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_20A_GFCI_Outlet.png?v=1612382967",
            name: "120v 20 Amp Standard Receptacle (5-20R)"
        },
        "L5-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_30A_Twist_Lock.png?v=1612382967",
            name: "120v 30 Amp Twist Lock (L5-30R)"
        },
        "L14-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_30A_Twist_Lock.png?v=1612382967",
            name: "120/240v 30 Amp Twist Lock (L14-30R)"
        },
        "L14-50R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_50A_Heavy_Duty_Outlet.png?v=1612382967",
            name: "120v/240v 50 Amp Heavy Duty Outlet (L14-50R)"
        },
        "14-50R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_240V_50A_Heavy_Duty_Outlet.png?v=1612382967",
            name: "120v/240v 50 Amp Heavy Duty Outlet (14-50R)"
        },
        "TT-30R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/120V_TT-30R.png?v=1612813988",
            name: "120v 30 Amp RV Ready (TT-30R)"
        },
        "L14-20R": {
            image_url: "https://cdn.shopify.com/s/files/1/1163/1976/files/125V_250V_20_Amp_Twist_Lock.png?v=1613276582",
            name: "125v/250v 20 Amp Twist Lock (L14-20R)"
        }
    }
    const [selectedPlug, setSelectedPlug] = useState({name, amount})
    const handleChange = ({ target }) => {
        setEditted(true)
        setSelectedPlug({
            ...selectedPlug,
            [target.name]: target.value
        })
    }
    const saveAndQuit = ({ target }) => {
        setEditted(false)
        handleSave(selectedPlug, index)
    }
    return (
        <div className="plugSelect">
            <button className="deleter" onClick={handleRemove}><img src="https://cdn-icons-png.flaticon.com/512/542/542724.png" width="16" height="16"/></button>
            <select value={selectedPlug.name} name="name" onChange={handleChange}>
                {Object.keys(plugMap).map(val => <option value={val}>{plugMap[val].name}</option>)}
            </select>
            <p>Quantity:</p>
            <input value={selectedPlug.amount} name="amount" type="number" onBlur={saveAndQuit} onChange={handleChange} />
            {editted && <button onClick={saveAndQuit}>SAVE</button>}
        </div>
    )
}