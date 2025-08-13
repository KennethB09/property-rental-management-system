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
    password: string,
    address: string,
    business_name: string,
    phone_number: string,
    profile_pic: string
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
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${import.meta.env.CLIENT}/${role}/dashboard`,
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
      console.log("Sign-in success:", data);
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
    password: string,
    address: string,
    business_name: string,
    phone_number: string,
    profile_pic: string
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
            address,
            business_name,
            phone_number,
            profile_pic,
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

    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, session, signOut, landlordSignUp }}
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
