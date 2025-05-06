
import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface CanProps {
  I: string;
  a: string;
  this?: Record<string, any>;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ I: action, a: subject, this: attributes, children }) => {
  const { can } = useAuth();
  
  return can(action, subject, attributes) ? <>{children}</> : null;
};
