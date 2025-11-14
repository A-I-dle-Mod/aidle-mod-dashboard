import type { Metadata } from "next";
import Image from "next/image";
import { UserProvider } from "@/components/user/user-context";
import { LayoutProvider } from '@/components/layout/layout-context';
import AppNavigation from '@/components/app/app-navigation';
import UserNavigation from "@/components/user/user-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "A.I.dle Mod Dashboard",
  description: "Dashboard for A.I.dle Mod, the AI-powered modding assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <LayoutProvider>
          <UserProvider>
            <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
              <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
                <nav className="flex h-full min-h-0 flex-col">
                  <div className="flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5">
                    <span className="relative">
                      <button className="inline-grid w-full grid-cols-[auto_1fr] items-center gap-x-3 rounded-md px-2 py-1 text-sm font-medium text-zinc-900 hover:bg-zinc-950/5 dark:text-zinc-100 dark:hover:bg-white/5">
                        <span data-slot="avatar">
                          <Image
                            src="/aidle-mod-logo.svg"
                            alt="Aidle Mod Logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto rounded-full bg-zinc-100 object-contain dark:bg-zinc-900"
                          />
                        </span>
                        <span className="truncate">A.I.dle Mod</span>
                      </button>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8">
                    <AppNavigation />
                    <div aria-hidden="true" className="mt-8 flex-1" />
                  </div>
                  <UserNavigation />
                </nav>
              </div>
              <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
                <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
                  <div className="mx-auto max-w-6xl">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </UserProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}