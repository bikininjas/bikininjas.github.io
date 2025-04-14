import { processEmbeds } from '../../lib/posts';

describe('processEmbeds function', () => {
  // Save original environment
  const originalEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    // Reset environment before each test
    process.env.NODE_ENV = 'development';
  });
  
  afterEach(() => {
    // Restore environment after each test
    process.env.NODE_ENV = originalEnv;
  });
  
  it('processes YouTube embeds correctly', () => {
    const content = '# Test\n![youtube](https://youtu.be/abcd1234 "Test Video")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container video-container">');
    expect(processed).toContain('<lite-youtube videoid="abcd1234"');
    expect(processed).toContain('playlabel="Test Video"');
  });
  
  it('processes YouTube embeds with options correctly', () => {
    const content = '# Test\n![youtube](https://youtu.be/abcd1234 "Test Video|start=30,autoplay=true,playsInline=true")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container video-container">');
    expect(processed).toContain('videoid="abcd1234"');
    expect(processed).toContain('start="30"');
    expect(processed).toContain('autoplay="true"');
    expect(processed).toContain('playsInline="true"');
  });

  it('processes Twitch embeds correctly', () => {
    const content = '# Test\n![twitch](channelname "Test Channel")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container twitch-container">');
    expect(processed).toContain('src="https://player.twitch.tv/?channel=channelname');
    expect(processed).toContain('parent=localhost');
  });

  it('processes Bluesky embeds correctly', () => {
    const content = '# Test\n![bluesky](https://bsky.app/profile/test.bsky.social/post/abcd1234)';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="bluesky-embed-container">');
    expect(processed).toContain('src="https://bsky.app/embed');
    expect(processed).toContain(encodeURIComponent('https://bsky.app/profile/test.bsky.social/post/abcd1234'));
  });

  it('handles content without embeds', () => {
    const content = '# Test\nThis is regular content without embeds.';
    const processed = processEmbeds(content);
    
    expect(processed).toBe(content);
  });

  it('processes multiple embeds correctly', () => {
    const content = `# Test
![youtube](https://youtu.be/123 "Video 1")
Some text in between
![twitch](channel1 "Channel 1")
More text
![bluesky](https://bsky.app/profile/test/post/abc)`;
    
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<lite-youtube videoid="123"');
    expect(processed).toContain('src="https://player.twitch.tv/?channel=channel1');
    expect(processed).toContain('src="https://bsky.app/embed');
  });
});
