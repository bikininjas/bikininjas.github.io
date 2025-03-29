import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import CategoryNav from '../components/CategoryNav';
import { getSortedPostsData, getAllCategories } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const categories = getAllCategories();
  return {
    props: {
      allPostsData,
      categories,
    },
  };
}

export default function Home({ allPostsData, categories }) {
  return (
    <Layout home title="BikiNinjas Blog - Home">
      <section className="hero">
        <h1 className="title">
          Welcome to <span>BikiNinjas Blog!</span>
        </h1>

        <p className="description">
          A modern blog built with Next.js and Markdown
        </p>
      </section>

      <section className="blog-section">
        <div className="blog-layout">
          <aside className="blog-sidebar">
            <CategoryNav categories={categories} currentCategory="all" />
          </aside>
          
          <div className="blog-main-content">
            <h2 className="section-title">Latest Posts</h2>
            <div className="grid">
          {allPostsData.map(({ id, date, title, excerpt }) => (
            <Link href={`/posts/${id}`} key={id} className="card-link">
              <article className="card">
                <div className="card-content">
                  <h3 className="card-title">{title}</h3>
                  <time className="card-date">{date}</time>
                  <p className="card-excerpt">{excerpt}</p>
                </div>
                <div className="card-arrow">
                  <span>&rarr;</span>
                </div>
              </article>
            </Link>
          ))}
            </div>
          </div>
        </div>
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
      category: PropTypes.string
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
