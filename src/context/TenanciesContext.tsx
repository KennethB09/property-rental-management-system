import type { tenanciesStatus } from "@/types/enums";
import type { tenancies } from "@/types/interface";
import { createContext, useReducer, type ReactNode } from "react";

type TenanciesState = {
  tenancies: tenancies[] | [];
};

type TenanciesActions =
  | { type: "SET_TENANCIES"; payload: tenancies[] }
  | { type: "CHANGE_STATUS"; payload: { id: string; status: tenanciesStatus } }
  | { type: "ADD_REQUEST"; payload: tenancies };

export type TenanciesContext = {
  tenancies: tenancies[] | [];
  dispatch: React.Dispatch<TenanciesActions>;
};

export const tenanciesContext = createContext<TenanciesContext | undefined>(
  undefined
);

const tenanciesReducer = (
  state: TenanciesState,
  action: TenanciesActions
): TenanciesState => {
  switch (action.type) {
    case "SET_TENANCIES":
      return {
        ...state,
        tenancies: action.payload,
      };
    case "CHANGE_STATUS":
      return {
        ...state,
        tenancies: state.tenancies.map((tenancy) =>
          tenancy.id === action.payload.id
            ? { ...tenancy, status: action.payload.status }
            : tenancy
        ),
      };
    case "ADD_REQUEST":
      return {
        ...state,
        tenancies: [action.payload, ...state.tenancies],
      };
    default:
      return state;
  }
};

export const TenanciesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(tenanciesReducer, {
    tenancies: [],
  });

  return (
    <tenanciesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </tenanciesContext.Provider>
  );
};
