'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/user/user-context';
import { UserContextType } from "@/lib/types/user-type";
import { ServersResponse, Server } from '@/lib/types/server-type';
import request from '@/lib/http/request';
import Image from "next/image";

export default function Home() {

  const [user, setUser] = useState<UserContextType | null>(null);
  const [servers, setServers] = useState<ServersResponse | null>(null);

  useUser().then(resp => setUser(resp));

  useEffect(() => {
    async function fetchServerInfo() {
      try {
        if (user !== null) {
          const serversResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds`);

          if (serversResponse.ok) {
            const serversData = await serversResponse.json();
            setServers(serversData);
          } else {
            console.error('Failed to fetch user servers');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchServerInfo();
  }, [user]);

  return (
    <>
      { user === null ? null : (
        <>
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Dashboard Home
            </h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Welcome, { user.global_name }!
            </p>
          </header>
          <div>
            <header>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Overview
              </h2>
            </header>

            { servers !== null && servers.guilds.length === 0 ? (
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                You are not moderating any servers with Aidle Mod.
              </p>
            ) : (
              <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                { servers !== null && servers.guilds.map((server: Server) => (
                  <div key={server.id}>
                    <hr role="presentation" className="w-full border-t border-zinc-950/10 dark:border-white/10" />
                    <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 inline-grid w-full grid-cols-[auto_1fr]">
                      {server.guild_icon !== null ? (
                        <span>
                          <Image
                            src={server.guild_icon}
                            alt={`Server icon for ${server.guild_name}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </span>
                      ) : ''}
                      <span className="m-1 ms-2">
                        { server.guild_name }
                      </span>
                    </div>
                    <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
                      {server.messages.length} Messages Moderated
                    </div>
                    <div className="mt-3 text-sm/6 sm:text-xs/6">
                      <span className="inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline bg-lime-400/20 text-lime-700 group-data-hover:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-data-hover:bg-lime-400/15">
                        +4.2%
                      </span>
                      <span className="text-zinc-500"> from last week</span>
                    </div>
                  </div>
                )) }
              </div>
            ) }
          </div>
        </>
      )}
      
    </>
  );
}
