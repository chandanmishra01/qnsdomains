import { useState } from 'react';
import { IBM_Plex_Mono } from 'next/font/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Nav, Footer } from '@/components/common';
import { StateProvider } from '@/store';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  const [transactionData, setTransactionData] = useState<TransactionData | undefined>(undefined);
  const [tokenData, setTokenData] = useState<TokenData | undefined>(undefined);
  
  return (
    <>
      <Head>
        <title>Quai Network Sample Dapp</title>
        <meta name="description" content="A sample dapp built on Quai Network." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StateProvider>
        {/* Background gradient effects */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* Bottom left corner gradient */}
          <div 
            className="absolute -bottom-[350px] -left-[350px] w-[800px] h-[800px] rounded-full opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(161, 27, 20, 0.4) 0%, rgba(122,0,0,0.1) 50%, rgba(0,0,0,0) 70%)',
              filter: 'blur(70px)',
            }}
          />
          
          {/* Bottom right corner gradient */}
          <div 
            className="absolute -bottom-[350px] -right-[350px] w-[800px] h-[800px] rounded-full opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(0,122,255,0.35) 0%, rgba(0,40,122,0.1) 50%, rgba(0,0,0,0) 70%)',
              filter: 'blur(70px)',
            }}
          />
        </div>
        
        <main className={ibmPlexMono.className}>
          <Nav />
          <Component
            {...pageProps}
            tokenData={tokenData}
            transactionData={transactionData}
            setTransactionData={setTransactionData}
            setTokenData={setTokenData}
          />
          <Footer />
        </main>
      </StateProvider>
    </>
  );
}

export default MyApp;