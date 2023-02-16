import { useState } from "react";

export default function ManualView({ name, href, index, handleSave, handleRemove }) {
    const [editted, setEditted] = useState(false)
    const [selectedManual, setSelectedManual] = useState({name, href})
    const handleChange = ({ target }) => {
        setEditted(true)
        setSelectedManual({
            ...selectedManual,
            [target.name]: target.value
        })
    }
    const saveAndQuit = () => {
        setEditted(false)
        handleSave(selectedManual, index)
    }
    return (
        <div className="manual">
            <button className="deleter" onClick={() => handleRemove(index)}><img src="https://cdn-icons-png.flaticon.com/512/542/542724.png" width="16" height="16"/></button>
            <input value={selectedManual.name} name="name" type="text" placeholder={"Name"} onChange={handleChange} />
            <input value={selectedManual.href} name="href" type="text" placeholder={"Link"} onChange={handleChange} />
            {editted && <button onClick={saveAndQuit}>SAVE</button>}
        </div>
    )
}