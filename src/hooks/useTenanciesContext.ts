import type { TenanciesContext } from "@/context/TenanciesContext";
import { tenanciesContext } from "@/context/TenanciesContext";
import { useContext } from "react";

export const useTenanciesContext = (): TenanciesContext => {
  const context = useContext(tenanciesContext);

  if (!context) {
    throw new Error(
      "Tenancies context must be used within a tenancies context provider."
    );
  }

  return context;
};
