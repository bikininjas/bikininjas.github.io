import React from 'react';
import PropTypes from 'prop-types';

const YouTubeEmbed = ({ videoId, title, width = '100%', height = '480px' }) => {
  return (
    <div className="video-container youtube-container">
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

YouTubeEmbed.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
};

export default YouTubeEmbed;
