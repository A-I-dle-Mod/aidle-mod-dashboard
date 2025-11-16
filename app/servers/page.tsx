'use client';

import { useEffect, useState } from 'react';
import { redirect, RedirectType } from 'next/navigation';
import { useUser } from '@/components/user/user-context';
import { ServersResponse, Server, Message } from '@/lib/types/server-type';
import { UserContextType } from '@/lib/types/user-type';
import request from '@/lib/http/request';
import Image from 'next/image';
import styles from './servers.module.css';

export default function Servers() {
  const [user, setUser] = useState<UserContextType | null>(null);
  const [servers, setServers] = useState<ServersResponse | null>(null);

  useUser().then((resp) => setUser(resp));

  function sortMessages(messages: Message[]) {
    const today = new Date();
    const previousWeek = new Date();
    previousWeek.setDate(today.getDate() - 7);

    const tallies = {
      today: 0,
      week: 0,
      allTime: 0,
    };

    messages.forEach((message: Message) => {
      const messageDate = new Date(message.created_date);
      tallies.allTime++;

      if (messageDate.toLocaleDateString() === today.toLocaleDateString()) {
        tallies.today++;
      }

      if (messageDate >= previousWeek && messageDate <= today) {
        tallies.week++;
      }
    });

    return tallies;
  }

  useEffect(() => {
    async function fetchServerInfo() {
      try {
        if (user !== null) {
          // Fetch the list of servers for the user too
          const serversResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds`);

          if (typeof serversResponse !== 'undefined' && serversResponse.ok) {
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

  function goToServer(guild_id: number) {
    redirect(`/servers/${guild_id}`, RedirectType.push);
  }

  return (
    <table className='min-w-full text-left text-sm/6 text-zinc-950 dark:text-white'>
      <thead>
        <tr className='border-b border-b-zinc-950/10'>
          <th className='p-2'>Name</th>
          <th className='p-2'>Messages Moderated (Today)</th>
          <th className='p-2'>Messages Moderated (This Week)</th>
          <th className='p-2'>Messages Moderated (All Time)</th>
          <th className='p-2'>Date Added</th>
        </tr>
      </thead>
      <tbody>
        {servers?.guilds.map((server: Server) => {
          return (
            <tr
              key={server.id}
              className={`border-b border-b-zinc-950/10 hover:bg-slate-200 ${styles.cursor}`}
              onClick={() => goToServer(server.guild_id)}
            >
              <td className='flex p-2'>
                {server.guild_icon !== null ? (
                  <Image
                    src={server.guild_icon}
                    alt={`Server icon for ${server.guild_name}`}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                ) : (
                  ''
                )}
                <span className='pl-2 p-1'>{server.guild_name}</span>
              </td>
              <td className='p-2'>{sortMessages(server.messages).today}</td>
              <td className='p-2'>{sortMessages(server.messages).week}</td>
              <td className='p-2'>{sortMessages(server.messages).allTime}</td>
              <td className='p-2'>{new Date(server.created_date).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
