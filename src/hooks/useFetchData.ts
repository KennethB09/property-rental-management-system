import { useState, useEffect } from "react";
import type { propertiesCount } from "@/types/appData";
import { useAuthContext } from "@/context/AuthContext";
import type { TpropertyType } from "@/types/enums";
import { useAppContext } from "./useAppContext";
import type { listing } from "@/types/interface";

export function useGetLandlordProperty() {
  const { session } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<propertiesCount>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getLandlordDashboardData() {
      setIsLoading(true);

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/rent-ease/api/landlord-count-properties/${session.user.id}`,
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
        setError(json.message);
        return;
      }

      setIsLoading(false);
      setData(json);
    }

    getLandlordDashboardData();
  }, []);

  return { isLoading, data, error };
}

export function getFilters() {
  const { session } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TpropertyType[] | []>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAppFilters() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/property-type`,
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
        setError(json.message);
        return;
      }

      setIsLoading(false);
      setFilters(json);
    }

    getAppFilters();
  }, []);

  return { isLoading, filters, error };
}

export function getListedProperties() {
  const { session } = useAuthContext();
  const { dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<listing[] | []>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProperties() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/listings`,
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
        setError(json.message);
        dispatch({ type: "SET_LISTINGS", payload: listings })
        return;
      }

      // console.log(json)
      setIsLoading(false);
      setListings(json);
      dispatch({ type: "SET_LISTINGS", payload: json })
    }

    getProperties();
  }, []);

  return { isLoading, listings, error };
}
