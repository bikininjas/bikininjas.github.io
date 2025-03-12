import React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import Layout from '../components/Layout';
import { getAllPosts } from '../lib/api';
import { PostType } from '../interfaces/post';

type HomeProps = {
  latestPosts: PostType[];
};

const Home = ({ latestPosts }: HomeProps) => (
  <Layout
    title="Home"
    description="Welcome to BikiNinjas Blog - A blog about society, mental health, video games, programming, game dev, and modding games."
  >
    <NextSeo
      title="Home"
      description="Welcome to BikiNinjas Blog - A blog about society, mental health, video games, programming, game dev, and modding games."
    />
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-primary-600">BikiNinjas Blog</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Exploring society, mental health, video games, programming, game
          development, and modding games.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/blog"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Read the Blog
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="/about"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
          Latest Posts
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <div
              key={post.slug}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    {post.category}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {post.date}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300">
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-base font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            View all posts
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
          Categories
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            'Society',
            'Mental Health',
            'Video Games',
            'Programming',
            'Game Dev',
            'Modding Games',
          ].map((category) => {
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={category}
                href={`/blog/category/${slug}`}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </Layout>
);

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category',
  ]);

  return {
    props: { latestPosts: allPosts.slice(0, 6) },
  };
};

export default Home;
