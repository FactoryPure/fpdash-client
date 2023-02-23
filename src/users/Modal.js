import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const DEFAULT_LIST_MAP = {
    "*": false,
    "product-setup": false,
    "shipping": false,
    "sales": false,
    "calls": false,
    "users": false,
    "scrape": false
}

export default function Modal({ focus, setFocus, setNeedsRefresh }) {
    const [showModal, setShowModal] = useState(false)
    const [isEditted, setIsEditted] = useState(false)
    const [userClone, setUserClone] = useState({})
    const { user } = useSelector(state => state)
    const sessionToken = sessionStorage.getItem("session_token")
    const canDelete = (selectedUser) => {
        if (user.type === "SuperAdmin" && user.email !== selectedUser.email) {
            return true
        }
        if (
            user.type === "Admin" && 
            user.email !== selectedUser.emai &&
            selectedUser.type !== "SuperAdmin" && 
            selectedUser.type !== "Admin"
            ) {
                return true
        } 
        return false
    }
    const canEditAccess = (selectedUser) => {
        if (selectedUser.type === "SuperAdmin") return false
        if (selectedUser.type === "Admin" && user.type === "Admin") return false
        return true
    }
    useEffect(() => {
        if (focus.email) {
            const access = Object.fromEntries(Object.entries(DEFAULT_LIST_MAP).map(([key, val]) => {
                if (focus.access.includes(key) || focus.access.includes("*")) {
                    return [key, true]
                } else {
                    return [key, false]
                }
            }))
            const newUser = {
                ...focus,
                access
            }
            setUserClone(structuredClone(newUser))
            setShowModal(true)
        } else {
            setUserClone({})
            setShowModal(false)
        }
    }, [focus])
    const handleSubmit = () => {

    }
    const handleDelete = () => {
        fetch(`https://api.fpdash.com/users/${userClone.email}`, {
            method: "DELETE",
            headers: {
                Authorization: sessionToken                
            }
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setIsEditted(false)
                setNeedsRefresh(true)
                setFocus({})
            } else {
                alert(res.message)
            }
        })
    }
    const handleClose = () => {
        setFocus({})
        setIsEditted(false)
    }
    const handleChangeAccess = ({ target }) => {
        setIsEditted(true)
        setUserClone({
            ...userClone,
            access: {
                ...userClone.access,
                [target.name]: target.checked
            }
        })
    }
    const handleUpdateAccess = () => {
        fetch("https://api.fpdash.com/users/access", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionToken
            },
            body: JSON.stringify({
                access: userClone.access["*"] ? ["*"] : Object.entries(userClone.access).map(([key, val]) => {
                    if (val) return key
                }).filter(a => a),
                email: userClone.email
            })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                setIsEditted(false)
                setNeedsRefresh(true)
                setFocus({})
            } else {
                alert(res.message)
            }
        })
    }
    return (
        <>
            {showModal && (
                <div className="focus">
                    <div className="focus__inner">
                        <h2 className="users__user__modal-heading">{userClone.type}</h2>
                        <div class="users__user__group">
                            <p className="users__user__group__name">{userClone.first_name} {userClone.last_name}</p>
                            <p className="users__user__group__email">{userClone.email}</p>
                        </div>
                        {<div class="users__user__access">
                            <p className="users__user__access__heading">Access</p>
                            <div style={!canEditAccess(userClone) ? {pointerEvents: 'none', opacity: 0.5} : {}} className="users__user__access__item">
                                <input className="users__user__access__item__input" id="*" type="checkbox" name="*" value={userClone.access["*"]} onChange={(e) => handleChangeAccess(e)} checked={userClone.access["*"]} />
                                <label className="users__user__access__item__label" for="*">All</label>
                            </div>
                            {Object.keys(userClone.access).map((route) => {
                                if (route !== "*") {
                                    return (
                                        <div style={!canEditAccess(userClone) || userClone.access["*"] ? {pointerEvents: 'none', opacity: 0.5} : {}} className="users__user__access__item">
                                            <input className="users__user__access__item__input" id={route} type="checkbox" name={route} checked={userClone.access[route] || userClone.access["*"]} onChange={(e) => handleChangeAccess(e)} />
                                            <label className="users__user__access__item__label" for={route}>{route.split("-").map(val => `${val.substring(0,1).toUpperCase()}${val.substring(1)}`).join(" ")}</label>
                                        </div>
                                    )
                                }
                            })}
                        </div>}
                    </div>
                    <div className="focus__buttons">
                        <button style={!isEditted ? {opacity: 0, display: 'none', pointerEvents: 'none'} : {}} className="focus__buttons__button" onClick={handleUpdateAccess}>SAVE</button>
                        {canDelete(userClone) && <button className="focus__buttons__button focus__buttons__button--delete" onClick={handleDelete}>DELETE</button>}
                        <button className="focus__buttons__button focus__buttons__button--close" onClick={handleClose}>CLOSE</button>
                    </div>
                </div>
            )}
        </>
    )
}