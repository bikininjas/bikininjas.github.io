import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import CategoryNav from '../../components/CategoryNav';
import PostParallax from '../../components/PostParallax';
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
      <PostParallax 
        title={postData.title}
        date={postData.date}
        category={postData.category}
        categories={postData.categories}
        backgroundImage={postData.coverImage}
      />
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
          
          <div 
            className="markdown post-content"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
            {postData.author && (
              <div className="author-footer">
                <hr />
                <div 
                  className="markdown"
                  dangerouslySetInnerHTML={{ __html: postData.authorHtml || `<p><strong>Written by:</strong> ${postData.author}</p>` }} 
                />
              </div>
            )}
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
    authorHtml: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    categorySlug: PropTypes.string.isRequired,
    contentHtml: PropTypes.string.isRequired,
    coverImage: PropTypes.string
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
