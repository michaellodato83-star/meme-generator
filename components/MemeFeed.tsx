'use client';

import { useDB } from '@/components/InstantDBProvider';
import { useState } from 'react';
import { id } from '@instantdb/react';

interface Meme {
  id: string;
  imageUrl: string;
  text: string;
  textConfig: string;
  createdAt: number;
  userId: string;
  upvoteCount: number;
}

interface Vote {
  id: string;
  memeId: string;
  userId: string;
}

export default function MemeFeed() {
  const db = useDB();
  if (!db) {
    return <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>Loading...</div>;
  }

  const { user } = db.useAuth();
  const { data, isLoading } = db.useQuery({
    memes: {},
    votes: {},
  });

  const memes = ((data?.memes || []) as Meme[]).sort((a, b) => b.createdAt - a.createdAt);
  const votes = ((data?.votes || []) as Vote[]);

  const handleUpvote = async (memeId: string) => {
    if (!user) {
      alert('Please sign in to upvote memes');
      return;
    }

    // Check if user already voted
    const userVote = votes.find(
      (v) => v.memeId === memeId && v.userId === user.id
    );

    if (userVote) {
      // Remove vote
      await db.transact(db.tx.votes[userVote.id].delete());
      
      // Decrement upvote count
      const meme = memes.find((m) => m.id === memeId);
      if (meme) {
        await db.transact(
          db.tx.memes[memeId].update({
            upvoteCount: Math.max(0, (meme.upvoteCount || 0) - 1),
          })
        );
      }
    } else {
      // Add vote
      const voteId = id();
      await db.transact(
        db.tx.votes[voteId].update({
          memeId,
          userId: user.id,
          createdAt: Date.now(),
        })
      );

      // Increment upvote count
      const meme = memes.find((m) => m.id === memeId);
      if (meme) {
        await db.transact(
          db.tx.memes[memeId].update({
            upvoteCount: (meme.upvoteCount || 0) + 1,
          })
        );
      }
    }
  };

  const getUserVote = (memeId: string) => {
    if (!user) return false;
    return votes.some((v) => v.memeId === memeId && v.userId === user.id);
  };

  const getUpvoteCount = (memeId: string) => {
    const meme = memes.find((m) => m.id === memeId);
    return meme?.upvoteCount || 0;
  };

  if (isLoading) {
    return (
      <div className="feed-container">
        <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '20px' }}>
          Meme Feed
        </h1>
        <div style={{ textAlign: 'center', color: 'white' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '20px' }}>
        Meme Feed
      </h1>
      {memes.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}>
          No memes yet. Be the first to post one!
        </div>
      ) : (
        <div className="meme-grid">
          {memes.map((meme) => {
            const hasVoted = getUserVote(meme.id);
            const upvoteCount = getUpvoteCount(meme.id);
            
            return (
              <div key={meme.id} className="meme-card">
                <img
                  src={meme.imageUrl}
                  alt={meme.text || 'Meme'}
                  className="meme-image"
                />
                {meme.text && (
                  <div className="meme-text">{meme.text}</div>
                )}
                <div className="meme-footer">
                  <button
                    className="upvote-button"
                    onClick={() => handleUpvote(meme.id)}
                    disabled={!user}
                    style={{
                      background: hasVoted ? '#764ba2' : '#667eea',
                    }}
                  >
                    👍 <span className="upvote-count">{upvoteCount}</span>
                  </button>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {new Date(meme.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

