import { createContext, useContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  googleId?: string;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const signup = async (credentials: { email: string; password: string; name: string }) => {
    const { data } = await axios.post<{ user: User; token: string }>(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      credentials
    );
    
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const login = async (credentials: { email: string; password: string }) => {
    const { data } = await axios.post<{ user: User; token: string }>(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const googleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <AuthContext.Provider value={{ user, signup , login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};