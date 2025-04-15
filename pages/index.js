import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import { getAllCategories } from '../lib/categories';
import Link from 'next/link';
import Date from '../components/date';
import PropTypes from 'prop-types';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const allCategories = getAllCategories();
  return {
    props: {
      allPostsData,
      allCategories,
    },
  };
}

export default function Home({ allPostsData = [], allCategories = [] }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Categories</h2>
        <ul className={utilStyles.list}>
          {allCategories.map(({ name, slug }) => (
            <li className={utilStyles.listItem} key={slug}>
              <Link href={`/categories/${slug}`}>
                <a>{name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

Home.propTypes = {
  allPostsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  allCategories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};