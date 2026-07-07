import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock database of registered users
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      name: 'Shaikh Mohammadtofik Isamuddin',
      email: 'mohammadtofik@example.com',
      phone: '7048786234',
      kycStatus: 'Verified',
    },
  ]);

  // Check if a phone number exists in our mock DB
  const checkPhoneRegistration = (phone) => {
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    return registeredUsers.some(
      (u) => u.phone.replace(/\D/g, '').slice(-10) === cleaned
    );
  };

  // Login: find user by phone and set as current user
  const login = (phone) => {
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    const found = registeredUsers.find(
      (u) => u.phone.replace(/\D/g, '').slice(-10) === cleaned
    );
    if (found) {
      setUser({ ...found });
      return true;
    }
    return false;
  };

  // Signup: add to mock DB and set as current user
  const signup = (userData) => {
    const newUser = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone.replace(/\D/g, '').slice(-10),
      kycStatus: 'Verified',
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser({ ...newUser });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, checkPhoneRegistration }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
