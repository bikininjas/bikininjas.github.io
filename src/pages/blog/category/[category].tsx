import React from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Layout from '../../../components/Layout';
import PostPreview from '../../../components/PostPreview';
import { getAllCategories, getPostsByCategory } from '../../../lib/api';
import { PostType } from '../../../interfaces/post';

type CategoryProps = {
  posts: PostType[];
  category: string;
};

const Category = ({ posts, category }: CategoryProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </h2>
        </div>
      </Layout>
    );
  }

  const formattedCategory = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Layout title={`${formattedCategory} Posts`}>
      <NextSeo
        title={`${formattedCategory} Posts`}
        description={`Read our latest blog posts about ${formattedCategory.toLowerCase()}.`}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {formattedCategory}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Read our latest blog posts about {formattedCategory.toLowerCase()}.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
              Check back soon for new content in this category!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({
  params,
}: {
  params: { category: string };
}) => {
  const posts = getPostsByCategory(params.category, [
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category',
  ]);

  return {
    props: {
      posts,
      category: params.category,
    },
  };
};

export const getStaticPaths = async () => {
  const categories = getAllCategories();

  return {
    paths: categories.map((category) => {
      return {
        params: {
          category: category.toLowerCase().replace(/\s+/g, '-'),
        },
      };
    }),
    fallback: 'blocking',
  };
};

export default Category;
