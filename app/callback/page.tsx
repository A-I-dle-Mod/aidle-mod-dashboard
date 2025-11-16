'use client';

import { useEffect, useState } from 'react';
import { redirect, RedirectType } from 'next/navigation';

export default function Callback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URI}/callback`;

  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuthToken() {
      if (code && authToken === null) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
            {
              method: 'POST',
              credentials: 'include', // Important to include cookies
            }
          );

          const body = await response.text();

          function setToken(token: string) {
            localStorage.setItem('user_token', token);
            setAuthToken(token);
          }

          setToken(body);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      }
    }
    fetchAuthToken();
  }, [authToken, code, redirectUri]);

  useEffect(() => {
    if (authToken) {
      // Redirect to homepage after setting the token
      redirect('/', RedirectType.replace);
    }
  }, [authToken]);

  // Make the request to the backend with the code and then send the user to the homepage
  // Once they have a cookie
  return '';
}
