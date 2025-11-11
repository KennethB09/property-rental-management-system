import { useState, useEffect } from "react";
import type { TProperty } from "@/types/appData";
import { useAuthContext } from "@/context/AuthContext";
import { usePropertyContext } from "./usePropertyContext";

export function useGetLandlordProperty() {
  const { session } = useAuthContext();
  const { dispatch } = usePropertyContext();

  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<TProperty[] | []>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getLandlordProperties() {
      setIsLoading(true);

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/rent-ease/api/landlord-get-properties/${session.user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        dispatch({ type: "SET_PROPERTIES", payload: properties });
        setError(json.message);
        return;
      }

      setIsLoading(false);
      setProperties(json.data);
      dispatch({ type: "SET_PROPERTIES", payload: json.data });
    }

    getLandlordProperties();
  }, []);

  return { isLoading, properties, error };
}
