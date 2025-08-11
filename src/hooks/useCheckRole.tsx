import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router';

type UserRole = 'tenant' | 'landlord' | 'guest';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRole('guest');
        setIsLoading(false);
        return;
      }

      // Fetch user role (you'll need to create this RPC function)
      const { data, error } = await supabase.rpc('get_user_role');
      
      if (error) {
        console.error('Error fetching user role:', error);
        setRole('guest');
      } else {
        setRole(data || 'guest');
      }
      
      setIsLoading(false);
    };

    checkUserRole();
  }, []);

  return { role, isLoading };
};