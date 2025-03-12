import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

const Layout = ({
  children,
  title = 'BikiNinjas Blog',
  description = 'A blog about society, mental health, video games, programming, game dev, and modding games.',
}: LayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
