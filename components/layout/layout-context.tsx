'use client';

// Use usePathname for catching route name.
import { usePathname } from 'next/navigation';
import Page from '@/app/callback/page';

export const LayoutProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  return <>{pathname === '/callback' ? Page() : children}</>;
};
