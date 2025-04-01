import { processEmbeds } from '../../lib/posts';

describe('processEmbeds function', () => {
  // Sauvegarde de l'environnement original
  const originalEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    // Réinitialiser l'environnement avant chaque test
    process.env.NODE_ENV = 'development';
  });
  
  afterEach(() => {
    // Restaurer l'environnement après chaque test
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
    expect(processed).toContain('<lite-youtube videoid="abcd1234"');
    expect(processed).toContain('playlabel="Test Video"');
    expect(processed).toContain('autoplay');
    expect(processed).toContain('playsinline');
    expect(processed).toContain('params="start=30"');
  });
  
  it('processes YouTube embeds with v= format correctly', () => {
    const content = '# Test\n![youtube](https://www.youtube.com/watch?v=abcd1234 "Test Video")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container video-container">');
    expect(processed).toContain('<lite-youtube videoid="abcd1234"');
  });
  
  it('processes Twitch embeds correctly in development environment', () => {
    process.env.NODE_ENV = 'development';
    const content = '# Test\n![twitch](https://twitch.tv/testchannel "Test Channel")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container twitch-container">');
    expect(processed).toContain('src="https://player.twitch.tv/?channel=testchannel&parent=localhost"');
    expect(processed).toContain('title="Test Channel"');
  });
  
  it('processes Twitch embeds correctly in production environment', () => {
    process.env.NODE_ENV = 'production';
    const content = '# Test\n![twitch](https://twitch.tv/testchannel "Test Channel")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container twitch-container">');
    expect(processed).toContain('src="https://player.twitch.tv/?channel=testchannel&parent=bikininjas.github.io"');
  });
  
  it('processes Bluesky embeds correctly', () => {
    const content = '# Test\n![bluesky](https://bsky.app/profile/test.bsky.social/post/abcd1234)';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="bluesky-embed-container">');
    expect(processed).toContain('src="https://bsky.app/embed?url=');
    expect(processed).toContain(encodeURIComponent('https://bsky.app/profile/test.bsky.social/post/abcd1234'));
  });
  
  it('handles content with multiple embeds correctly', () => {
    const content = `
      # Test Post
      
      Here is a YouTube video:
      ![youtube](https://youtu.be/abcd1234 "Test Video")
      
      And a Twitch stream:
      ![twitch](https://twitch.tv/testchannel "Test Channel")
      
      And a Bluesky post:
      ![bluesky](https://bsky.app/profile/test.bsky.social/post/abcd1234)
    `;
    
    const processed = processEmbeds(content);
    
    expect(processed).toContain('<div class="embed-container video-container">');
    expect(processed).toContain('<div class="embed-container twitch-container">');
    expect(processed).toContain('<div class="bluesky-embed-container">');
  });
  
  it('returns the original content when no embeds are present', () => {
    const content = '# Test\nThis is a regular markdown post without embeds.';
    const processed = processEmbeds(content);
    
    expect(processed).toBe(content);
  });
});
