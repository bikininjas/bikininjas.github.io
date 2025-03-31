import PropTypes from 'prop-types';
import Layout from '../components/layout';
import CategoryNav from '../components/CategoryNav';
import ParallaxHero from '../components/ParallaxHero';
import PostCard from '../components/PostCard';
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
    <Layout home title="BikiNinjas - Accueil">
      <ParallaxHero 
        title="BikiNinjas" 
        subtitle="Jeux Vidéo, Développement & Bien-être Numérique" 
      />

      <section className="blog-section">
        <div className="blog-layout">
          <aside className="blog-sidebar">
            <CategoryNav categories={categories} currentCategory="all" />
          </aside>
          
          <div className="blog-main-content">
            <h2 className="section-title">Derniers Articles</h2>
            <div className="grid">
              {allPostsData.map((post) => (
                <PostCard key={post.id} post={post} />
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
