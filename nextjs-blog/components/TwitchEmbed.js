import React from 'react';
import PropTypes from 'prop-types';

const TwitchEmbed = ({ channelName, clipId, videoId, width = '100%', height = '480px', parent = 'localhost' }) => {
  let embedUrl;
  
  if (channelName) {
    // Channel embed
    embedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${parent}`;
  } else if (clipId) {
    // Clip embed
    embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=${parent}`;
  } else if (videoId) {
    // Video embed
    embedUrl = `https://player.twitch.tv/?video=${videoId}&parent=${parent}`;
  }

  if (!embedUrl) {
    return <div>Error: Missing required Twitch parameters</div>;
  }

  return (
    <div className="video-container twitch-container">
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
        title="Twitch Stream Embed"
      ></iframe>
    </div>
  );
};

TwitchEmbed.propTypes = {
  channelName: PropTypes.string,
  clipId: PropTypes.string,
  videoId: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  parent: PropTypes.string
};

export default TwitchEmbed;
