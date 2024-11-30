'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative w-20 h-20 mb-4">
        <Image
          src="/icon-192x192.png"
          alt="Tulpar Express"
          width={96}
          height={96}
          priority
          className="h-auto w-auto"
        />
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-sm text-foreground">Loading... {progress}%</p>
    </div>
  );
}
