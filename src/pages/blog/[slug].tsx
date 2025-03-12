import React from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { format } from 'date-fns';
import Layout from '../../components/Layout';
import { getPostBySlug, getAllPosts } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';
import { PostType } from '../../interfaces/post';

type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  // Handle potentially invalid date values
  let formattedDate = '';
  try {
    if (post.date) {
      formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
    }
  } catch (error) {
    // Silently handle the error and use a fallback
    formattedDate = 'Invalid date';
  }

  return (
    <Layout title={post.title} description={post.excerpt}>
      {router.isFallback ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </h2>
        </div>
      ) : (
        <>
          <NextSeo
            title={post.title}
            description={post.excerpt}
            openGraph={{
              title: post.title,
              description: post.excerpt,
              images: [
                {
                  url: post.ogImage?.url || post.coverImage,
                  width: 1200,
                  height: 630,
                  alt: post.title,
                },
              ],
            }}
          />
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {post.category}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {formattedDate}
                </span>
              </div>
              {post.coverImage && (
                <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-lg mb-8">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>

            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.author && (
              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex items-center">
                  {post.author.picture && (
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={post.author.picture}
                        alt={post.author.name}
                        className="rounded-full"
                        fill
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">Author</p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </>
      )}
    </Layout>
  );
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'excerpt',
    'category',
  ]);

  const content = await markdownToHtml((post.content as string) || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts
      .filter((post) => !!post.slug) // Filter out posts with undefined slugs
      .map((post) => ({
        params: {
          slug: post.slug as string,
        },
      })),
    fallback: false,
  };
};

export default Post;
