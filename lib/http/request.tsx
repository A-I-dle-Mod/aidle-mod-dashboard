'use client';

export default async function request(url: string, method: string = 'GET', body: object = {}) : Promise<Response> {
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

  let response;

  if (method.toLowerCase() === 'post') {
    headers['Content-Type'] = 'application/json';

    response = await fetch(url, {
      method: method.toUpperCase(),
      credentials: 'include',
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(url, {
      method: method.toUpperCase(),
      credentials: 'include',
      headers
    });
  }
  

  return response
}