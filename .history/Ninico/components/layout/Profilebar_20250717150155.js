'use client';
import React, { useContext } from 'react';
import AuthContext from '@/components/context/AuthContext';
import ProfileModal from '@/components/Modal/ProfileModal';

export default function Profilebar({ onLoginClick, show, onClose }) {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <ProfileModal 
      show={show}
      onClose={onClose}
      user={user}
      logout={logout}
      onLoginClick={onLoginClick}
    />
  );
}
