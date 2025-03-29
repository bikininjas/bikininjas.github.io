import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import CategoryNav from '../../components/CategoryNav';
import { getAllPostIds, getPostData, getAllCategories } from '../../lib/posts';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  const categories = getAllCategories();
  return {
    props: {
      postData,
      categories,
    },
  };
}

export default function Post({ postData, categories }) {
  return (
    <Layout title={postData.title}>
      <div className="blog-section">
        <div className="blog-layout">
          <aside className="blog-sidebar">
            <CategoryNav categories={categories} currentCategory={postData.category} />
            <div className="back-to-home">
              <Link href="/">← Back to all posts</Link>
            </div>
          </aside>
          
          <div className="blog-main-content">
            <article className="post-article">
          <header className="post-header">
            <h1 className="post-title">{postData.title}</h1>
            <div className="post-meta">
              <time className="post-date">{postData.date}</time>
              {postData.author && <span className="post-author">By: {postData.author}</span>}
              <Link href={`/categories/${postData.categorySlug}`} className="post-category">
                {postData.category}
              </Link>
            </div>
          </header>
          
          <div 
            className="markdown post-content"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Post.propTypes = {
  postData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string,
    category: PropTypes.string.isRequired,
    categorySlug: PropTypes.string.isRequired,
    contentHtml: PropTypes.string.isRequired
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
