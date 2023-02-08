import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Layout from "../layout/Layout"

export default function HomeScreen() {
    const { user } = useSelector(state => state)
    return (
        <>
            {user &&
                    <h1>Welcome, {user.firstName}</h1>
            }
        </>
    )
}