import { ReactNode } from 'react'
import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen text-base-content">
      <Head>
        <title>Synergistic</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-col justify-center w-full text-center px-[20px] lg:px-0 md:container md:mx-auto mt-[50px]">
        {children}
      </main>
      <Footer />
    </div>
  )
}