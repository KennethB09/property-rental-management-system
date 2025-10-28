import type { LucideProps } from "lucide-react";
import { Link } from "react-router";

type Ttab = "Home" | "Chats" | "Manage" | "Menu";

type NavigationItemProps = {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  url: string;
  onClick: (param: Ttab) => void;
  activeTab: string;
};

export default function NavigationItem({
  Icon,
  label,
  url,
  onClick,
  activeTab,
}: NavigationItemProps) {
  return (
    <div
      className={
        activeTab === label
          ? "hover:cursor-pointer text-green-700"
          : "hover:cursor-pointer hover:text-green-700"
      }
      onClick={() => onClick(label as Ttab)}
    >
      <Link className="flex flex-col items-center" to={url}>
        <Icon size={25} />
        <h1 className="font-semibold text-sm capitalize">{label}</h1>
      </Link>
    </div>
  );
}
