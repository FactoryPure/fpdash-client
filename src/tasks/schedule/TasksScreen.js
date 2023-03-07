import { useEffect, useState } from "react"

export default function TasksScreen() {
    const [tasks, setTasks] = useState([])
    const sessionToken = sessionStorage.getItem("session_token")
    useEffect(() => {
        fetch("https://api.fpdash.com/tasks/all", {
            headers: {
                Authorization: sessionToken
            }
        }).then(res => res.json()).then(res => setTasks(res.tasks))
    }, [])
    return (
        <>{tasks.map(t => <p>{JSON.stringify(t)}</p>)}</>
    )
}