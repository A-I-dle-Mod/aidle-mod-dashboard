'use client';

import { use, useEffect, useState } from 'react';
import { useUser } from '@/components/user/user-context';
import { UserContextType } from "@/lib/types/user-type";
import { ServerResponse, Message } from '@/lib/types/server-type';
import request from '@/lib/http/request';

export default function ServerDetails({
  params,
}: {
  params: Promise<{ guild_id: string }>
}) {
  const { guild_id } = use(params);
  const [user, setUser] = useState<UserContextType | null>(null);
  const [server, setServer] = useState<ServerResponse | null>(null);

  useUser().then(resp => setUser(resp));

  useEffect(() => {
    async function fetchServerInfo() {
      try {
        if (user !== null) {
          // Fetch the list of servers for the user too
          const serversResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds/${guild_id}`);

          if (typeof serversResponse !== 'undefined' && serversResponse.ok) {
            const serversData = await serversResponse.json();
            setServer(serversData);
          } else {
            console.error('Failed to fetch user servers');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchServerInfo();
  }, [user, guild_id]);

  return (
    <>
      <header>
        <h2>{server?.guild.guild_name}</h2>
      </header>
      <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white mt-8">
        <caption className="caption-top text-slate-500">
          Scores represent harmful language detected, lower scores mean less harmful language.
        </caption>
        <thead>
          <tr className="border-b border-b-zinc-950/10">
            <th className="p-2">Message Sent</th>
            <th className="p-2">Author</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {server?.guild.messages?.map((message: Message) => {
            return (
              <tr key={message.id} className="border-b border-b-zinc-950/10">
                <td className="flex p-2">
                  {new Date(message.created_date).toLocaleString()}
                </td>
                <td className="p-2">
                  {message.author_name}
                </td>
                <td className="p-2">
                  {(message.score * 100).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}