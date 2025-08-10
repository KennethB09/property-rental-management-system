import { useAuthContext } from "@/context/AuthContext"

export default function Settings() {
    const { signOut } = useAuthContext();

    return (
        <div>
            <button onClick={signOut}>signout</button>
        </div>
    )
}