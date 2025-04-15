import axios from 'axios';
const authURL = import.meta.env.VITE_AUTH_URL;

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  googleId?: string;
};

export const signupUser = async (credentials: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data } = await axios.post<{ user: User; token: string }>(
    `${authURL}/api/auth/signup`,
    credentials
  );
  return data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await axios.post<{ user: User; token: string }>(
    `${authURL}/api/auth/login`,
    credentials
  );
  return data;
};

export const logoutUser = async () => {
  return await axios.post(`${authURL}/api/auth/logout`);
};

export const getLoggedInUser = async () => {
  const { data } = await axios.get<{ user: User }>(
    `${authURL}/api/auth/me`
  );
  return data;
};

export const redirectToGoogle = () => {
  window.location.href = `${authURL}/api/auth/google`;
};
