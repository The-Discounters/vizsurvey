'use client';

import { useRouter } from 'next/navigation';

// Compatibility hook to match react-router-dom's useNavigate API
export function useNavigate() {
  const router = useRouter();
  
  return (path) => {
    router.push(path);
  };
}
