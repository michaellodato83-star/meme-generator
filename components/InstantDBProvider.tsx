'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { init } from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || 'fda6ef94-6b35-4f00-aa6b-741cde16c47b';

// Create a context for the db instance - initialize lazily
const DBContext = createContext<ReturnType<typeof init> | null>(null);

export function useDB() {
  return useContext(DBContext);
}

export default function Provider({
  children,
}: {
  children: ReactNode;
}) {
  const [db, setDb] = useState<ReturnType<typeof init> | null>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined' && !db) {
      const dbInstance = init({
        appId: APP_ID,
      });
      setDb(dbInstance);
    }
  }, []);

  if (!db) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>;
  }

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>;
}

