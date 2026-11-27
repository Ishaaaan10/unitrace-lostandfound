'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';
import { PRESET_USERS } from '../lib/mockData';
import { getStoredUser, saveStoredUser } from '../lib/storage';

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchPresetUser: (userId: string) => void;
  isSecurityOfficer: boolean;
  isStudent: boolean;
  allPresetUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(PRESET_USERS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setCurrentUserState(stored);
    setIsLoaded(true);
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    saveStoredUser(user);
  };

  const switchPresetUser = (userId: string) => {
    const target = PRESET_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const isSecurityOfficer = currentUser.role === 'CAMPUS_SECURITY' || currentUser.role === 'ADMIN';
  const isStudent = currentUser.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchPresetUser,
        isSecurityOfficer,
        isStudent,
        allPresetUsers: PRESET_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
