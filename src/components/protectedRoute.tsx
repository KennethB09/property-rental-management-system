import React from "react";
import { Navigate } from "react-router";
import { useUserRole } from "../hooks/useCheckRole";
import { useAuthContext } from "@/context/AuthContext";
import logoLight from "@/assets/logo/logo-light.svg";
import { Loader2 } from "lucide-react";

type UserRole = "tenant" | "landlord" | "guest";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["tenant", "landlord"],
  redirectPath = "/auth/tenant-login",
}) => {
  const { role, isLoading } = useUserRole();
  const { session } = useAuthContext();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <img src={logoLight} className="w-20 aspect-square" />
        <Loader2 className="animate-spin text-gray-900" />
      </div>
    );
  }

  if (!allowedRoles.includes(role) || !session) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles.length > 1) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <>{children}</>;
};
