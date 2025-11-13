import type { tenantSaves } from "@/types/appData";
import type { TpropertyType } from "@/types/enums";
import type { listing } from "@/types/interface";
import { createContext, useReducer, type ReactNode } from "react";

type AppState = {
  listings: listing[] | [];
  recentListings: listing[] | [];
  nearestListings: listing[] | [];
  saves: tenantSaves[] | [];
  propetyType: TpropertyType[] | [];
};

type AppAction =
  | { type: "SET_LISTINGS"; payload: listing[] }
  | { type: "SET_RECENT_LISTINGS"; payload: listing[] }
  | { type: "SET_NEAREST_LISTINGS"; payload: listing[] }
  | { type: "SET_PROPERTY_TYPE"; payload: TpropertyType[] }
  | { type: "SET_SAVES"; payload: tenantSaves[] }
  | { type: "ADD_NEW_SAVE"; payload: tenantSaves }
  | { type: "REMOVE_SAVE"; payload: string };

export type AppContextType = {
  listings: listing[] | [];
  recentListings: listing[] | [];
  nearestListings: listing[] | [];
  saves: tenantSaves[] | [];
  propetyType: TpropertyType[] | [];
  dispatch: React.Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LISTINGS":
      return {
        ...state,
        listings: action.payload,
      };
    case "SET_RECENT_LISTINGS":
      return {
        ...state,
        recentListings: action.payload,
      };
    case "SET_NEAREST_LISTINGS":
      return {
        ...state,
        nearestListings: action.payload,
      };
    case "SET_PROPERTY_TYPE":
      return {
        ...state,
        propetyType: action.payload,
      };
    case "SET_SAVES":
      return {
        ...state,
        saves: action.payload,
      };
    case "ADD_NEW_SAVE":
      return {
        ...state,
        saves: [action.payload, ...state.saves],
      };
    case "REMOVE_SAVE":
      return {
        ...state,
        saves: state.saves.filter((item) => item.listing_ID !== action.payload),
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    listings: [],
    recentListings: [],
    nearestListings: [],
    saves: [],
    propetyType: [],
  });

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
