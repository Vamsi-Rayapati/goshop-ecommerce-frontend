'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'src/contexts/AuthContext';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isAuthenticated, needsOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading or on onboard page
    if (isLoading || pathname === '/onboard') {
      return;
    }

    // If authenticated but needs onboarding, redirect to onboard
    if (isAuthenticated && needsOnboarding) {
      router.push('/onboard');
    }
  }, [isAuthenticated, needsOnboarding, isLoading, router, pathname]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If needs onboarding and not on onboard page, don't render children
  if (isAuthenticated && needsOnboarding && pathname !== '/onboard') {
    return null;
  }

  return <>{children}</>;
}
