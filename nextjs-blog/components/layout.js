import Head from 'next/head';
import PropTypes from 'prop-types';
import Navbar from './Navbar';

export default function Layout({ children, home, title = 'BikiNinjas Blog' }) {
  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A Next.js Markdown blog" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar title="BikiNinjas" />

      <div className="container">
        <main className="main">
          {children}
        </main>

        <footer>
          <p>© {new Date().getFullYear()} BikiNinjas Blog. Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  home: PropTypes.bool,
  title: PropTypes.string
};

Layout.defaultProps = {
  home: false
};
