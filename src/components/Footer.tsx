import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const categories = [
    { name: 'Society', href: '/blog/category/society' },
    { name: 'Mental Health', href: '/blog/category/mental-health' },
    { name: 'Video Games', href: '/blog/category/video-games' },
    { name: 'Programming', href: '/blog/category/programming' },
    { name: 'Game Dev', href: '/blog/category/game-dev' },
    { name: 'Modding Games', href: '/blog/category/modding-games' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              BikiNinjas Blog
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A blog about society, mental health, video games, programming, game development, and modding games.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Links
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>© {currentYear} BikiNinjas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
