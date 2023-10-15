import { ClerkProvider } from '@clerk/clerk-react';
import { Inter } from "next/font/google";

import '../globals.css';

export const metadata = {
  title: 'Strands',
  description: 'A next.js 13 social networking application'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <ClerkProvider frontendApi="your_frontend_api_key_here">
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
} 