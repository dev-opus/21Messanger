import './globals.css';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { getConfig, Providers } from '@/app/config';
import { cookieToInitialState } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie')
  );

  return (
    <html lang="en">
      <head>
        <title>21Messsanger 🚀🚀</title>
      </head>
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <div className="container">
            <header>
              <div className="logo">21Messsanger 🚀🚀</div>
              <ConnectButton />
            </header>
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
