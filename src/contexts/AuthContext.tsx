import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
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
  logout: () => Promise<void>;
  googleLogin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  // Update the request interceptor in your AuthProvider
const requestInterceptor = axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Initialize headers if they don't exist
    config.headers ??= {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get<{ user: User }>(
            `${import.meta.env.VITE_AUTH_URL}/api/auth/me`
          );
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    validateToken();
  }, []);

  const signup = async (credentials: { email: string; password: string; name: string }) => {
    try {
      const { data } = await axios.post<{ user: User; token: string }>(
        `${import.meta.env.VITE_AUTH_URL}/api/auth/signup`,
        credentials
      );
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post<{ user: User; token: string }>(
        `${import.meta.env.VITE_AUTH_URL}/api/auth/login`,
        credentials
      );
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if needed (e.g., for session invalidation)
      await axios.post(`${import.meta.env.VITE_AUTH_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/api/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, googleLogin }}>
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