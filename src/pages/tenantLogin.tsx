import AuthPageNav from "@/components/authPageNav"
import { ModeToggle } from "@/components/modeToggle"
export default function TenantLogin() {
    return (
        <div>
            <AuthPageNav />
            <ModeToggle />
            <p className="bg-green-400">login</p>
        </div>
    )
}