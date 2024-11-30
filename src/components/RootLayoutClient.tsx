'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import Onboarding from '@/components/Onboarding';
import { AuthProvider } from '@/components/AuthProvider';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      setShowOnboarding(!onboardingCompleted);
      setInitialLoadComplete(true);
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  if (!initialLoadComplete) {
    return <LoadingScreen />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
}
