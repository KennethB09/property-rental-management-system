import type { TProperty } from "@/types/appData";
import { createContext, useReducer, type ReactNode } from "react";

type PropertyState = {
  properties: TProperty[] | [];
};

type PropertyAction =
  | { type: "SET_PROPERTIES"; payload: TProperty[] }
  | { type: "ADD_PROPERTY"; payload: TProperty }
  | { type: "UPDATE_PROPERTY"; payload: TProperty }
  | { type: "DELETE_PROPERTY"; payload: string };

export type PropertiesContext = {
  properties: TProperty[] | [];
  dispatch: React.Dispatch<PropertyAction>;
};

export const propertyContext = createContext<PropertiesContext | undefined>(
  undefined
);

export const propertyReducer = (
  state: PropertyState,
  action: PropertyAction
): PropertyState => {
  switch (action.type) {
    case "SET_PROPERTIES":
      return {
        ...state,
        properties: action.payload,
      };
    case "ADD_PROPERTY":
      return {
        ...state,
        properties: [action.payload, ...state.properties],
      };
    case "UPDATE_PROPERTY":
      return {
        ...state,
        properties: state.properties.map((property) =>
          property.id === action.payload.id
            ? (property = action.payload)
            : property
        ),
      };
    case "DELETE_PROPERTY":
      return {
        ...state,
        properties: state.properties.filter(
          (property) => property.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(propertyReducer, {
        properties: []
    });

    return (
        <propertyContext.Provider value={{...state, dispatch}}>
            { children }
        </propertyContext.Provider>
    )
};
