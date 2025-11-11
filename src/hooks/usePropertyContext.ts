import type { PropertiesContext } from "@/context/PropertyContext";
import { propertyContext } from "@/context/PropertyContext";
import { useContext } from "react";

export const usePropertyContext = (): PropertiesContext => {
  const context = useContext(propertyContext);
  if (!context) {
    throw new Error('Property context must be used within a Property Context Provider');
  }
  return context;
};