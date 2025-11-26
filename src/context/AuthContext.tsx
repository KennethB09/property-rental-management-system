import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type UserRole = "tenant" | "landlord" | "guest";

type AuthContextType = {
  signUp: (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    occupation: string,
    role: UserRole
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  landlordSignUp: (
    role: UserRole,
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  landlordAccountSetup: (
    img: string,
    address: string,
    business_name: string,
    phone_number: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<void>;
  session: any | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<any | undefined>(undefined);

  const signUp = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    occupation: string,
    role: UserRole
  ) => {
    try {
      // console.log({ role, first_name, last_name, phone_number, occupation });
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_CLIENT}/${role}/dashboard`,
          data: {
            role,
            first_name,
            last_name,
            phone_number,
            occupation,
            profile_pic: "",
          },
        },
      });
      if (error) {
        console.log("Sign-up error:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error: any) {
      console.error("Error during signup:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred during signup",
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
      if (error) {
        console.log("Sign-in error:", error);
        return { success: false, error: error.message };
      }
      // console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (error: any) {
      console.error("Sign-in error:", error);
      return {
        success: false,
        error:
          error.message || "An unexpected error occurred. Please try again.",
      };
    }
  };

  const landlordSignUp = async (
    role: UserRole,
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${import.meta.env.CLIENT}/${role}/dashboard`,
          data: {
            role,
            first_name,
            last_name,
          },
        },
      });
      if (error) {
        // console.log("Sign-up error:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error: any) {
      console.error("Error during signup:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred during signup",
      };
    }
  };

  const landlordAccountSetup = async (
    img: string,
    address: string,
    business_name: string,
    phone_number: string
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/complete-setup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: session.user.id,
          img: img,
          address: address,
          business_name: business_name,
          phone_number: phone_number,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          json.message || "An unexpected error occurred. Please try again.",
      };
    }

    return { success: true, data: json };
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }

    localStorage.removeItem("activeTab");
    localStorage.removeItem("TenantActiveTab");
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        session,
        signOut,
        landlordSignUp,
        landlordAccountSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
