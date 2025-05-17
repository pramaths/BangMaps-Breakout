import './globals.css';
import { Inter } from 'next/font/google';
import WalletContextProvider from "@/contexts/WalletContextProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bang Maps',
  description: 'Bang Maps is a tool for visualizing data on maps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
        {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
