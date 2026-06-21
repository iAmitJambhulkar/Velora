'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, initialized, pathname, router]);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // If it's a protected path and we are not initialized or not authenticated,
  // render a loading screen to avoid content flashing.
  if (!isPublicPath && (!initialized || !user)) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#F5F1EB] min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#4F6D5A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-sm text-[#4F6D5A] italic">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
