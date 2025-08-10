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
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function authPageNav() {
  const [select, onSelect] = useState<"tenant" | "landlord">("tenant");
  const { theme } = useTheme();
  return (
    <nav className="flex flex-row justify-between items-center h-20">
      <img
        className="w-10 aspect-square"
        src={theme === "dark" ? logoDark : logoLight}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="capitalize font-semibold text-gray-900 border-gray-900">
            {select}
            <ChevronDown className="text-gray-900" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSelect("tenant")}>
            Tenant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelect("landlord")}>
            Landlord
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
