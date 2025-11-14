import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

type UserRole = 'tenant' | 'landlord' | 'guest';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<null | any>(null);
  // const navigate = useNavigate();

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

      setUserInfo(user);
      // Fetch user role
      const { data, error } = await supabase.rpc('get_user_role');
      
      if (error) {
        console.error('Error fetching user role:', error);
        setRole('guest');
      } else {
        setRole(data);
      }
      
      setIsLoading(false);
    };

    checkUserRole();
  }, []);

  return { role, isLoading, userInfo };
};