import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

export default function UsersScreen() {
    const { user } = useSelector(state => state)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user.access.includes("*")) {
            navigate("/home")
        }
    })
    return (
        <>
            {user && <h1>Users</h1>}
        </>
    )
}