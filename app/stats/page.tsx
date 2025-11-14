'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/user/user-context';
import { UserContextType } from "@/lib/types/user-type";
import { MessagesResponse, Message } from '@/lib/types/server-type';
import { Me } from '@/lib/types/me-type';
import request from '@/lib/http/request';

export default function Stats() {

  const [user, setUser] = useState<UserContextType | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [messages, setMessages] = useState<MessagesResponse | null>(null);

  useUser().then(resp => setUser(resp));

  useEffect(() => {
    async function fetchMeInfo() {
      try {
        if (user !== null) {
          const meResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/me`);
          const messageStatsResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/message-stats`);

          if (meResponse.ok) {
            setMe(await meResponse.json())
          }

          if (messageStatsResponse.ok) {
            setMessages(await messageStatsResponse.json())
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchMeInfo();
  }, [user]);

  return (
    <>
      <header>
        <h2>Total requests for today: {messages !== null && messages.data.length}/{me?.plan.max_requests}</h2>
      </header>

      <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white mt-8">
        <caption className="caption-top text-slate-500">
          Scores represent harmful language detected, lower scores mean less harmful language.
        </caption>
        <thead>
          <tr className="border-b border-b-zinc-950/10">
            <th className="p-2">Message Sent</th>
            <th className="p-2">Server</th>
            <th className="p-2">Author</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {messages?.data.map((message: Message) => {
            return (
              <tr key={message.id} className="border-b border-b-zinc-950/10">
                <td className="flex p-2">
                  {new Date(message.created_date).toLocaleString()}
                </td>
                <td className="p-2">
                  {message.guild.guild_name}
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
