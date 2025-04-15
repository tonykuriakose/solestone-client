import {createContext,useContext,useEffect,useState,ReactNode,} from 'react';
import { useNavigate } from 'react-router-dom';
import {signupUser,loginUser,logoutUser,getLoggedInUser,redirectToGoogle,User} from '../api/authApi';
import axios from 'axios';

type AuthContextType = {
  user: User | null;
  signup: (credentials: { email: string; password: string; name: string }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      config.headers ??= {};
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user } = await getLoggedInUser();
          setUser(user);
        } catch {
          localStorage.removeItem('token');
        }
      }
    };
    validate();
  }, []);

  const signup = async (credentials: {
    email: string;
    password: string;
    name: string;
  }) => {
    const { user, token } = await signupUser(credentials);
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const login = async (credentials: { email: string; password: string }) => {
    const { user, token } = await loginUser(credentials);
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  const googleLogin = () => redirectToGoogle();

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
