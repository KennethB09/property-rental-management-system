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
  signOut: () => Promise<void>;
  session: any | undefined;
  userRole: UserRole;
  loading: boolean; // Add loading state
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<any | undefined>(undefined);
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(true); // Add loading state

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
          emailRedirectTo: import.meta.env.CLIENT,
          data: {
            role, // Store role in user metadata
            first_name,
            last_name,
            phone_number,
            occupation,
            profile_pic: "",
          },
        },
      });
      if (error) throw error;
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
      if (error) throw error;
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

  // Extract role fetching into a separate function
  const fetchUserRole = async (currentSession: any = null) => {
    const sessionToUse = currentSession || session;
    
    if (sessionToUse?.user) {
      try {
        console.log("Fetching user role for:", sessionToUse.user.id);
        
        // Option 1: Try to get role from user metadata first
        const roleFromMetadata = sessionToUse.user.user_metadata?.role;
        if (roleFromMetadata && ['tenant', 'landlord'].includes(roleFromMetadata)) {
          console.log("Role from metadata:", roleFromMetadata);
          setUserRole(roleFromMetadata);
          return;
        }
        
        // Option 2: Fallback to RPC function
        const { data, error } = await supabase.rpc("get_user_role");
        if (error) {
          console.error("RPC error:", error);
          throw error;
        }
        
        console.log("Role from RPC:", data);
        setUserRole(data || "guest");
        
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest");
      }
    } else {
      console.log("No session, setting role to guest");
      setUserRole("guest");
    }
  };

  // Handle session changes and fetch role accordingly
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounted

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);
        
        if (isMounted) {
          setSession(initialSession);
          await fetchUserRole(initialSession);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setSession(null);
          setUserRole("guest");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (isMounted) {
        setSession(currentSession);
        
        // Handle different auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchUserRole(currentSession);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, resetting to guest");
          setUserRole("guest");
        }
        
        // Set loading to false after any auth state change
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array is correct here

  async function signOut() {
    try {
      console.log("Starting signout process...");
      setLoading(true); // Set loading during signout
      
      // Immediately reset state
      setUserRole("guest");
      setSession(null);
      
      // Then call Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Signout successful");
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, reset the local state
      setUserRole("guest");
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, session, signOut, userRole, loading }}
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