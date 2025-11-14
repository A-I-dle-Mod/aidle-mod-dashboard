'use client';

export default async function request(url: string) : Promise<Response> {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('user_token') === null) {
      const discordAuthUrl = process.env.NEXT_PUBLIC_DISCORD_AUTH_URL;
      window.location = discordAuthUrl;
    }
  }

  const cookieName = process.env.NEXT_PUBLIC_USER_COOKIE_NAME;
  const headers: Record<string, string> = {};
  if (cookieName) {
    headers[cookieName] = localStorage.getItem('user_token') || '';
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  return response
}