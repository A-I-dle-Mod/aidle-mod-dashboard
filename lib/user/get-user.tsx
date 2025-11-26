'use client';

import type { UserContextType } from '@/lib/types/user-type';
import request from '@/lib/http/request';

export default function GetUser(): Promise<UserContextType> {
  const response = request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/discord/me`);

  return Promise.resolve(response.then((res) => res.json()));
}
