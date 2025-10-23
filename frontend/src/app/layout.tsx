// src/app/layout.tsx - UPDATE THIS FILE
"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import { Provider } from 'react-redux';
import { store } from '@/store';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Provider store={store}>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}