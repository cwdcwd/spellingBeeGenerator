// filepath: /Users/cwd/Desktop/_code/spellingGenerator/src/app/page.tsx
"use client";

import Link from 'next/link';
// import { Metadata } from 'next';
import './globals.css';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </head>
      <body className="antialiased">
        <nav className="navbar">
          <Link href="/generate">Generate List</Link>
          <Link href="/test">Test</Link>
        </nav>
        {children}
        <style jsx>{`
          .navbar {
            width: 100%;
            background-color: #333;
            padding: 10px;
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .navbar a {
            color: #fff;
            text-decoration: none;
            font-size: 18px;
          }
          .navbar a:hover {
            text-decoration: underline;
          }
        `}</style>
      </body>
    </html>
  );
}