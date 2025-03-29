import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Bike Ninjas Blog!</a>
        </h1>

        <p className="description">
          A blog built with Next.js and Markdown
        </p>

        <div className="grid">
          <h2 className="blogHeading">Blog Posts</h2>
          {allPostsData.map(({ id, date, title, excerpt }) => (
            <Link href={`/posts/${id}`} key={id}>
              <div className="card">
                <h3>{title} &rarr;</h3>
                <p className="blogDate">{date}</p>
                <p>{excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      {/* Styles moved to globals.css */}

    </div>
  );
}

Home.propTypes = {
  allPostsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      excerpt: PropTypes.string
    })
  ).isRequired
};
