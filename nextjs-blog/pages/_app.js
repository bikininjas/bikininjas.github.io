import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.css';
import '../styles/embeds.css';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Importer dynamiquement lite-youtube-embed seulement côté client
    if (typeof window !== 'undefined') {
      import('lite-youtube-embed/src/lite-yt-embed');
      import('lite-youtube-embed/src/lite-yt-embed.css');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};

export default MyApp;
