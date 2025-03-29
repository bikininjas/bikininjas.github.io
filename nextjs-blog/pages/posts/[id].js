import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { getAllPostIds, getPostData } from '../../lib/posts';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <div className="container">
      <Head>
        <title>{postData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="backToHome">
          <Link href="/">← Back to home</Link>
        </div>
        
        <article className="article">
          <h1 className="title">{postData.title}</h1>
          <div className="lightText">
            <p>{postData.date}</p>
            {postData.author && <p>By: {postData.author}</p>}
          </div>
          <div 
            className="markdown"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
        </article>
      </main>
    </div>
  );
}

Post.propTypes = {
  postData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string,
    contentHtml: PropTypes.string.isRequired
  }).isRequired
};
