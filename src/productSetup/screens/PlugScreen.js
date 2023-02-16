import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PlugSelectView from "../components/PlugSelectView"
import PlugView from "../components/PlugView"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const { plugs } = useSelector(state => state).sections
    const [currentPlugs, setCurrentPlugs] = useState(plugs)
    const handleSave = (plug, index) => {
        const newPlugs = [...currentPlugs]
        newPlugs.splice(index, 1, plug)
        setCurrentPlugs(newPlugs)
    }
    const handleRemove = (index) => {
        const newPlugs = [...currentPlugs]
        newPlugs.splice(index, 1)
        setCurrentPlugs(newPlugs)
    }
    const addPlug = () => {
        setCurrentPlugs([
            ...currentPlugs,
            { name: '5-20R', amount: 1 }
        ])
    }
    useEffect(() => {
        dispatch(setSections({plugs: currentPlugs}))
    }, [currentPlugs])
    return (
        <>
            <div className="plugbox">
                {currentPlugs.map((plug, index) => <PlugSelectView name={plug.name} amount={plug.amount} index={index} handleSave={handleSave} handleRemove={handleRemove} />)}
                <button style={{margin: '0 auto'}} onClick={addPlug}>Add Plug</button>
            </div>
            {(plugs && plugs.length > 0) && (
                <div className="description-preview">
                    {plugs.map(p => <PlugView name={p.name} amount={p.amount} />)}
                </div>
            )}
        </>
    )
}