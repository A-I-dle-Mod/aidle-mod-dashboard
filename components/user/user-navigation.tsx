'use client';

import Image from "next/image";
import {
  useState,
} from 'react';
import { useUser } from '@/components/user/user-context';
import { UserContextType } from "@/lib/types/user-type";

export default function UserNavigation() {

  const [user, setUser] = useState<UserContextType | null>(null);

  useUser().then(resp => setUser(resp));

  return (
    <>
      {user === null ? '' : (
        <div className="max-lg:hidden flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5">
          <span className="relative">
            <button className="inline-grid w-full grid-cols-[auto_1fr] items-center gap-x-3 rounded-md px-2 py-1 text-sm font-medium text-zinc-900 hover:bg-zinc-950/5 dark:text-zinc-100 dark:hover:bg-white/5">
              <span data-slot="avatar">
                <Image
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`}
                  alt="Aidle Mod Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto rounded-full bg-zinc-100 object-contain dark:bg-zinc-900"
                />
              </span>
              <span className="truncate">{ user.global_name }</span>
            </button>
          </span>
        </div>
      )}
    </>
  );
}