import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

type PostPreviewProps = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
  category: string;
};

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  slug,
  category,
}: PostPreviewProps) => {
  // Handle potentially invalid date values
  let formattedDate = '';
  try {
    if (date) {
      formattedDate = format(new Date(date), 'MMMM dd, yyyy');
    }
  } catch {
    // Silently handle the error and use a fallback
    formattedDate = 'Invalid date';
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {coverImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {category}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500">
            {title}
          </h3>
        </Link>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-300">
          {excerpt}
        </p>
        <div className="mt-4">
          <Link
            href={`/blog/${slug}`}
            className="text-base font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
