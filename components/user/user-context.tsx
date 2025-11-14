'use client';

import React, {
  createContext,
} from 'react';
import type { UserContextType } from '@/lib/types/user-type';
import GetUser from "@/lib/user/get-user";

const UserContext = createContext<Promise<UserContextType> | null>(null);

export function UserProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const user = GetUser();

  return (
    <UserContext.Provider value={ user }>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};