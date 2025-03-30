import React from 'react';
import PropTypes from 'prop-types';
import YouTubeEmbed from './YouTubeEmbed';
import TwitchEmbed from './TwitchEmbed';
import TwitterEmbed from './TwitterEmbed';
import BlueskyEmbed from './BlueskyEmbed';

const SocialEmbed = ({ type, ...props }) => {
  switch (type.toLowerCase()) {
    case 'youtube':
      return <YouTubeEmbed {...props} />;
    case 'twitch':
      return <TwitchEmbed {...props} />;
    case 'twitter':
    case 'x':
      return <TwitterEmbed {...props} />;
    case 'bluesky':
      return <BlueskyEmbed {...props} />;
    default:
      return <div>Unsupported embed type: {type}</div>;
  }
};

SocialEmbed.propTypes = {
  type: PropTypes.oneOf(['youtube', 'twitch', 'twitter', 'x', 'bluesky']).isRequired,
  // Other props are passed through to the specific embed components
};

export default SocialEmbed;
