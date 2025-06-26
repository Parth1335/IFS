import api from './axios';

export const loginUser = async (username, password) => {
  const response = await api.post('token/', {
    username,
    password,
  });
  return response.data;
};

export function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}