'use client';

import Auth from '@/components/Auth';
import MemeGenerator from '@/components/MemeGenerator';
import MemeFeed from '@/components/MemeFeed';
import { useState } from 'react';
import Link from 'next/link';
import { useDB } from '@/components/InstantDBProvider';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Home() {
  const db = useDB();
  const [activeTab, setActiveTab] = useState<'create' | 'feed'>('feed');

  if (!db) {
    return <div style={{ textAlign: 'center', color: 'white', padding: '100px' }}>Loading...</div>;
  }

  const { user, isLoading } = db.useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '100px' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <nav className="nav">
        <Link
          href="#"
          className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('feed');
          }}
        >
          Feed
        </Link>
        <Link
          href="#"
          className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('create');
          }}
        >
          Create Meme
        </Link>
        <button
          onClick={async () => {
            if (db) {
              await db.auth.signOut();
            }
          }}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Sign Out
        </button>
      </nav>
      {activeTab === 'feed' ? <MemeFeed /> : <MemeGenerator />}
    </div>
  );
}

