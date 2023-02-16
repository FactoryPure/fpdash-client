export default function User({ user, setFocus }) {
    return (
        <div class="users__user" onClick={() => setFocus(user)}>
            <div class="users__user__details">
                <p class="users__user__title">{user.first_name} {user.last_name}</p>
                <p class="users__user__email">{user.email}</p>
            </div>
            <div class="users__user__details">
                <p class="users__user__heading">Type</p>
                <p>{user.type}</p>
            </div>
            <div class="users__user__details">
                <p class="users__user__heading">Access</p>
                <p>{JSON.parse(user.access).map(a => {
                    if (a === "*") {
                        return <p>All Routes</p>
                    } else {
                        const parsedRoute = a.split("-").map(val => `${val.substring(0,1).toUpperCase()}${val.substring(1)}`).join(" ")
                        return <p>{parsedRoute}</p>
                    }
                })}</p>
            </div>
        </div>
    )
}