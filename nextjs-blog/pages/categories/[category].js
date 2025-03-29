import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import CategoryNav from '../../components/CategoryNav';
import { getAllCategories, getAllCategorySlugs, getCategoryFromSlug, getPostsByCategorySlug } from '../../lib/posts';

export async function getStaticPaths() {
  const categorySlugs = getAllCategorySlugs();
  
  const paths = categorySlugs.map((slug) => ({
    params: {
      category: slug,
    },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.category;
  const category = getCategoryFromSlug(slug);
  const postsData = getPostsByCategorySlug(slug);
  const categories = getAllCategories();
  
  return {
    props: {
      category,
      categorySlug: slug,
      postsData,
      categories,
    },
  };
}

export default function CategoryPage({ category, categorySlug, postsData, categories }) {
  return (
    <Layout title={`${category} - BikiNinjas Blog`}>
      <section className="blog-section">
        <div className="blog-layout">
          <aside className="blog-sidebar">
            <CategoryNav categories={categories} currentCategory={category} />
          </aside>
          
          <div className="blog-main-content">
            <h2 className="section-title">Posts in {category}</h2>
            
            {postsData.length > 0 ? (
              <div className="grid">
                {postsData.map(({ id, date, title, excerpt }) => (
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
            ) : (
              <div className="no-posts">
                <p>No posts found in this category.</p>
                <Link href="/" className="back-link">
                  &larr; Back to all posts
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

CategoryPage.propTypes = {
  category: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  postsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      category: PropTypes.string,
      categorySlug: PropTypes.string
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
