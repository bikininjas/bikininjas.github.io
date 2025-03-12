import React from 'react';
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
import PostPreview from '../../components/PostPreview';
import { getAllPosts } from '../../lib/api';
import { PostType } from '../../interfaces/post';

type BlogProps = {
  allPosts: PostType[];
};

const Blog = ({ allPosts }: BlogProps) => (
  <Layout
    title="Blog"
    description="Read our latest blog posts about society, mental health, video games, programming, game dev, and modding games."
  >
    <NextSeo
      title="Blog"
      description="Read our latest blog posts about society, mental health, video games, programming, game dev, and modding games."
    />
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Read our latest blog posts about society, mental health, video games,
          programming, game dev, and modding games.
        </p>
      </div>

      {allPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              slug={post.slug}
              excerpt={post.excerpt}
              category={post.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            No posts found
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Check back soon for new content!
          </p>
        </div>
      )}
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
    props: { allPosts },
  };
};

export default Blog;
