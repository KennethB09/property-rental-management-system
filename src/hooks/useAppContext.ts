import { useContext } from "react";
import type { AppContextType } from "@/context/AppContext";
import { AppContext } from "@/context/AppContext"; 

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('App context must be used within a App Context Provider');
  }
  return context;
};