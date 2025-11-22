import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const savedSession = await AsyncStorage.getItem('userSession');
      if (savedSession) {
        const userData = JSON.parse(savedSession);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem('userSession', JSON.stringify(newUser));
  };

  const clearUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userSession');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};