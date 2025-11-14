'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, ServerStackIcon, ChartBarSquareIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function AppNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: <HomeIcon width={24} />,
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/servers',
      icon: <ServerStackIcon width={24} />,
      label: 'Servers',
      active: pathname.indexOf('/servers') !== -1,
    },
    {
      href: '/stats',
      icon: <ChartBarSquareIcon width={24} />,
      label: 'Stats',
      active: pathname.indexOf('/stats') !== -1,
    },
    {
      href: '/premium',
      icon: <ShoppingCartIcon width={24} />,
      label: 'Premium',
      active: pathname.indexOf('/premium') !== -1,
    }
  ];

  return (
    <>
      <div data-slot="section" className="flex flex-col gap-0.5">
        {navItems.map(item => {
          return (
            <span key={item.href} className="relative">
              {item.active ? <span className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white" /> : ''}
              <Link href={item.href} className="flex w-full p-2 rounded-md hover:bg-slate-200">
                { item.icon }
                <span className="truncate ml-8">
                  { item.label }
                </span>
              </Link>
            </span>
          );
        })}
      </div>
    </>
  );
}