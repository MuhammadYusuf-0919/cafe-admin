
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { definePermissions } from '@/lib/permissions';

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'Manager User',
    role: 'manager' as UserRole,
    password: 'manager123',
    email: 'manager@mesa.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Chef User',
    role: 'chef' as UserRole,
    password: 'chef123',
    email: 'chef@mesa.com',
    avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Waiter User',
    role: 'waiter' as UserRole,
    password: 'waiter123',
    email: 'waiter@mesa.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  can: (action: string, subject: string, attributes?: Record<string, any>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ability, setAbility] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('restaurant-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      // Define user permissions when user changes
      const newAbility = definePermissions(user);
      setAbility(newAbility);
    } else {
      // Set guest permissions
      const guestAbility = definePermissions(null);
      setAbility(guestAbility);
    }
  }, [user]);

  const can = (action: string, subject: string, attributes?: Record<string, any>) => {
    if (!ability) return false;
    return ability.can(action, subject, attributes);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in mock data
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Create user object without the password
      const { password, email, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('restaurant-user', JSON.stringify(userWithoutPassword));
      toast.success('Qaytib kelganingizdan xursandmiz!');
      
      // Redirect based on role
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
    
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant-user');
    toast.info('Siz tizimdan chiqdingiz');
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        can
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
