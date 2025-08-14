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
import { useNavigate } from "react-router";

type Tselect = "tenant" | "landlord";

type AuthPageNavProps = {
  setSelect: Tselect
}

export default function authPageNav({ setSelect }: AuthPageNavProps) {
  const [select, onSelect] = useState<Tselect>(setSelect);
  const navigate = useNavigate();
  const { theme } = useTheme();

  function handleSelect(param: Tselect) {
    onSelect(param);
    navigate(`/auth/${param}-login`);
  }
  return (
    <nav className="flex flex-row justify-between items-center h-20">
      <img
        className="w-10 aspect-square"
        src={theme === "dark" ? logoDark : logoLight}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="capitalize font-semibold text-gray-900 border-gray-900"
          >
            {select}
            <ChevronDown className="text-gray-900" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSelect("tenant")}>
            Tenant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("landlord")}>
            Landlord
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
