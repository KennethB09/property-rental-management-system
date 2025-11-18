import { createContext, type ReactNode } from "react";
import { useContext } from "react";
import { useAuthContext } from "./AuthContext";
import type { conversation, tenant } from "@/types/interface";
import type { occupation } from "@/types/appData";

type ApiContextType = {
  getTenantProfile: () => Promise<{ data?: tenant; error?: string }>;
  getTenantSaves: () => Promise<{ data?: any; error?: string }>;
  tenantSave: (
    listing_ID: string,
    user_ID: string
  ) => Promise<{ data?: any; error?: string }>;
  tenantRemoveSave: (
    listing_ID: string
  ) => Promise<{ data?: any; error?: string }>;
  getOccupantType: () => Promise<{ data?: occupation[]; error?: string }>;
  getConversations: (
    role: "tenant" | "landlord"
  ) => Promise<{ data?: conversation[]; error?: string }>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const ApiProvider = ({ children }: Props) => {
  const { session } = useAuthContext();

  const getTenantProfile = async (): Promise<{
    data?: tenant;
    error?: string;
  }> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/tenant-profile/${
          session.user.id
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { error: data?.message ?? "Failed to fetch tenant profile" };
      }

      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const getTenantSaves = async (): Promise<{ data?: any; error?: string }> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/tenant/saves/${
          session.user.id
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return { error: data?.message ?? "Failed to fetch tenant saves" };
      }
      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const tenantSave = async (
    listing_ID: string,
    user_ID: string
  ): Promise<{ data?: any; error?: string }> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/tenant/save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing_ID, user_ID }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return { error: data?.message ?? "Failed to save listing" };
      }
      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const tenantRemoveSave = async (
    listing_ID: string
  ): Promise<{ data?: any; error?: string }> => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/rent-ease/api/tenant/remove-save/${listing_ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        return { error: data?.message ?? "Failed to remove save" };
      }
      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const getOccupantType = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/occupantion-type`,
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { error: data?.message ?? "Failed to remove save" };
      }
      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const getConversations = async (role: "tenant" | "landlord") => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/rent-ease/api/${role}/get-conversations/${session.user.id}`,
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { error: data?.message ?? "Failed to remove save" };
      }
      return { data };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  return (
    <ApiContext.Provider
      value={{
        getTenantProfile,
        getTenantSaves,
        tenantSave,
        tenantRemoveSave,
        getOccupantType,
        getConversations,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within ApiProvider");
  return context;
};
