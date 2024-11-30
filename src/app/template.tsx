'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import RootLayoutClient from '@/components/RootLayoutClient';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RootLayoutClient>{children}</RootLayoutClient>
    </ThemeProvider>
  );
}
