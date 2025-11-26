import { useState } from "react";
import logoLight from "../assets/logo/logo-light.svg";
import logoDark from "../assets/logo/logo-dark.svg";
import { useTheme } from "@/components/themeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { NavLink, Outlet } from "react-router";

type Tselect = "tenant" | "landlord";

export default function AuthPageLayout() {
  const [select, onSelect] = useState<Tselect>("tenant");
  const { theme } = useTheme();

  return (
    <>
      <nav className="flex flex-row justify-between items-center h-20 px-10 max-sm:px-5 dark:bg-gray-950">
        <img
          className="w-10 aspect-square"
          src={theme === "dark" ? logoDark : logoLight}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="capitalize font-semibold text-gray-900 border-gray-900 dark:border-slate-100 dark:text-slate-100"
            >
              {select}
              <ChevronDown className="text-gray-900 dark:text-slate-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild onClick={() => onSelect("tenant")}>
              <NavLink to={"/auth/tenant-login"}>Tenant</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => onSelect("landlord")}>
              <NavLink to={"/auth/landlord-login"}>Landlord</NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <Outlet />
    </>
  );
}
