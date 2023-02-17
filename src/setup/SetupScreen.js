import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { setUser } from "../redux/user"

export default function SetupScreen({ setToken }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [newUserData, setNewUserData] = useState({
        email: "",
        token: ""
    })
    const [searchParams] = useSearchParams()
    useEffect(() => {
        setNewUserData({
            email: searchParams.get("email"),
            token: searchParams.get("token")
        })
    }, [])
    const handleCreate = (e) => {
        e.preventDefault()
        fetch("https://api.fpdash.com/users/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': newUserData.token
            },
            body: JSON.stringify({
                email: newUserData.email,
                password: e.target['password'].value,
                firstName: e.target['first_name'].value,
                lastName: e.target['last_name'].value
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                dispatch(setUser({
                    firstName: res.first_name,
                    lastName: res.last_name,
                    email: res.email,
                    type: res.type,
                    access: JSON.parse(res.access)
                }))
                sessionStorage.setItem("session_token", res.token)
                navigate("/home")
            } else {
                alert(res.message)
            }
        })
    }
    return (
        <div className="setup">
            {newUserData.token ? (
                <>
                    <h1 className="login__heading">Welcome to The FactoryPure Dashboard!</h1>
                    <form onSubmit={handleCreate} className="login__form">
                        <input className="login__input" value={newUserData.email} type="email" name="email" id="email" placeholder="email" readonly />
                        <input className="login__input" type="password" name="password" id="password" placeholder="password" />
                        <input className="login__input" type="text" name="first_name" id="first_name" placeholder="First Name" />
                        <input className="login__input" type="text" name="last_name" id="last_name" placeholder="Last Name" />
                        <button type="submit" className="login__submit">Sign Up</button>
                    </form>
                </>
            ) : (
                <>
                    <h1>Something went wrong! <Link to={'/login'}>Go home</Link></h1>
                </>
            )}
            <style>
                {`
                    body {
                        padding: 0;
                        background: linear-gradient(
                        270deg,
                        #92b3d1 0%,
                        rgba(137, 208, 5, 0.3) 60%,
                        rgba(255, 255, 255, 0.7) 100%
                        );
                    }
                    body::after {
                        content: "";
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        background-size: 50px 50px;
                        background-image: linear-gradient(to right, #eeeeee 2px, transparent 2px),
                        linear-gradient(to bottom, #eeeeee 2px, transparent 2px);
                        z-index: -1;
                        mix-blend-mode: color-burn;
                        pointer-events: none;
                    }
                    .topbar {
                        background: transparent !important;
                    }
                `}
            </style>
        </div>
    )
}