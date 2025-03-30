import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const BlueskyEmbed = ({ postUrl, theme = 'light' }) => {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the post ID and handle from the URL
  // Example URL: https://bsky.app/profile/username.bsky.social/post/3kgiqoiuqwz2r
  const extractPostInfo = (url) => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes('/post/')) {
        throw new Error('Invalid Bluesky post URL');
      }
      
      const pathParts = urlObj.pathname.split('/');
      const profileIndex = pathParts.indexOf('profile');
      
      if (profileIndex === -1 || profileIndex + 3 >= pathParts.length) {
        throw new Error('Invalid Bluesky post URL format');
      }
      
      const handle = pathParts[profileIndex + 1];
      const postId = pathParts[profileIndex + 3];
      
      return { handle, postId };
    } catch (err) {
      setError('Invalid Bluesky URL format');
      return null;
    }
  };

  useEffect(() => {
    // This is a placeholder for actual Bluesky API integration
    // In a real implementation, you would fetch the post data from the Bluesky API
    const postInfo = extractPostInfo(postUrl);
    
    if (postInfo) {
      // Simulate fetching data
      setTimeout(() => {
        setPostData({
          author: postInfo.handle,
          postId: postInfo.postId,
          // Other post data would come from the API
        });
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [postUrl]);

  if (loading) {
    return <div className="bluesky-embed-loading">Loading Bluesky post...</div>;
  }

  if (error) {
    return <div className="bluesky-embed-error">{error}</div>;
  }

  if (!postData) {
    return <div className="bluesky-embed-error">Could not load Bluesky post</div>;
  }

  // Render a simple card for the Bluesky post
  // In a production app, you would style this to match Bluesky's design
  return (
    <div className={`bluesky-embed-container bluesky-theme-${theme}`}>
      <div className="bluesky-embed-card">
        <div className="bluesky-embed-header">
          <span className="bluesky-embed-author">@{postData.author}</span>
          <a 
            href={postUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bluesky-embed-link"
          >
            View on Bluesky
          </a>
        </div>
        <div className="bluesky-embed-content">
          {/* Post content would come from the API */}
          <p>This is a placeholder for the Bluesky post content. In a real implementation, this would show the actual post content fetched from the Bluesky API.</p>
        </div>
      </div>
    </div>
  );
};

BlueskyEmbed.propTypes = {
  postUrl: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['light', 'dark'])
};

export default BlueskyEmbed;
