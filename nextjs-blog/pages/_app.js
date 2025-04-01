import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.css';
import '../styles/embeds.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Importer dynamiquement lite-youtube-embed seulement côté client
    if (typeof window !== 'undefined') {
      import('lite-youtube-embed/src/lite-yt-embed');
      import('lite-youtube-embed/src/lite-yt-embed.css');
    }
  }, []);

  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};

export default MyApp;
