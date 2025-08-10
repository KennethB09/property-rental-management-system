import { Link, NavLink, Outlet } from "react-router"

export default function TenantDashboard() {
    return (
        <div>
            <NavLink to={"/settings"}>Settings</NavLink>
            <Outlet />
            <p>Tenant Dashboard</p>
        </div>
    )
}