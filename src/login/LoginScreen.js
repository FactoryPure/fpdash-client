import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUser } from "../redux/user"
import "./LoginScreen.css"

export default function LoginScreen() {
    const { user } = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        fetch("https://api.fpdash.com/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json()).then((res) => {
            console.log(res)
            if (res.success) {
                sessionStorage.setItem("session_token", res.token)
                dispatch(setUser({
                    firstName: res.first_name,
                    lastName: res.last_name,
                    email: res.email,
                    type: res.type,
                    access: JSON.parse(res.access)
                }))
                navigate("/home")
            } else {
                alert("LOGIN FAILED")
            }
        }).catch(err => {
            console.log(err)
            alert("LOGIN FAILED")
        })
    }
    useEffect(() => {
        if (user) {
            navigate("/home")
        }
    })
    return (
        <div className="login">
            <h1 className="login__heading">Welcome</h1>
            <form onSubmit={handleLogin} className="login__form">
              <input className="login__input" type="email" name="email" id="email" placeholder="email" />
              <input className="login__input" type="password" name="password" id="password" placeholder="password" />
              <button type="submit" className="login__submit">SUBMIT</button>
            </form>
            <p className="login__forgot" onClick={() => alert("Tell Geoff and he will let you back in!")}>Forgot your password?</p>
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