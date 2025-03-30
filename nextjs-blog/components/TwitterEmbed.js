import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const TwitterEmbed = ({ tweetId, theme = 'light' }) => {
  useEffect(() => {
    // Load Twitter widget script
    if (typeof window !== 'undefined') {
      window.twttr = (function(d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        let js;
        const t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };
        return t;
      }(document, "script", "twitter-wjs"));

      // Render the tweet
      window.twttr?.widgets?.load();
    }
  }, [tweetId]);

  return (
    <div className="twitter-embed-container">
      <blockquote 
        className="twitter-tweet" 
        data-theme={theme}
        data-dnt="true"
      >
        <a href={`https://twitter.com/x/status/${tweetId}`}>Loading Tweet...</a>
      </blockquote>
    </div>
  );
};

TwitterEmbed.propTypes = {
  tweetId: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['light', 'dark'])
};

export default TwitterEmbed;
