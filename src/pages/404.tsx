import React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import Layout from '../components/Layout';

const Custom404 = () => (
  <Layout
    title="Page Not Found"
    description="The page you are looking for does not exist."
  >
    <NextSeo
      title="404 - Page Not Found"
      description="The page you are looking for does not exist."
      noindex
    />
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Oops! The page you are looking for might have been removed or is
        temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
      >
        Return to Home
      </Link>
    </div>
  </Layout>
);

export default Custom404;
