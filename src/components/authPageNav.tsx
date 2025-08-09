import { useState } from "react";
import logoLight from "../assets/logo/rentease - logo2.svg";
import logoDark from "../assets/logo/logo-dark.svg"
import { useTheme } from "@/components/themeProvider"

export default function authPageNav() {
    const [select, onSelect] = useState("tenant");
    const { theme } = useTheme()
    return (
        <nav className="flex flex-row justify-between items-center px-10">
            <img className="w-20 aspect-square" src={theme === "dark" ? logoDark : logoLight}/>
            <select className="bg-transparent text-gray-900 font-semibold border-2 rounded-sm border-gray-900 px-4 py-2 w-28" value={select} onChange={e => onSelect(e.target.value)}>
                <option value={"tenant"}>Tenant</option>
                <option value={"landlord"}>Landlord</option>
            </select>
        </nav>
    )
}