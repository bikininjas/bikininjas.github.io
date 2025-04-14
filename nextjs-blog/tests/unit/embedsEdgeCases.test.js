import { processEmbeds } from '../../lib/posts';

describe('Embeds Edge Cases', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('handles malformed YouTube URLs', () => {
    const testCases = [
      '![youtube]()',
      '![youtube](invalid-url)',
      '![youtube](https://invalid.com)',
      '![youtube](https://youtu.be/)',
      '![youtube](https://youtube.com/watch?v=)',
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles malformed Twitch URLs', () => {
    const testCases = [
      '![twitch]()',
      '![twitch](invalid-url)',
      '![twitch](https://invalid.com)',
      '![twitch](https://twitch.tv/)',
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles malformed Bluesky URLs', () => {
    const testCases = [
      '![bluesky]()',
      '![bluesky](invalid-url)',
      '![bluesky](https://invalid.com)',
      '![bluesky](https://bsky.app/)',
      '![bluesky](https://bsky.app/profile/)',
      '![bluesky](https://bsky.app/profile/user/)',
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles multiple mixed embeds with some invalid', () => {
    const content = `# Test Post
![youtube](https://youtu.be/valid123 "Valid YouTube")
![twitch](invalid-url)
Some text
![bluesky](https://bsky.app/profile/user/post/valid456)
![youtube](https://youtu.be/)`;

    const processed = processEmbeds(content);
    
    expect(processed).toContain('<lite-youtube videoid="valid123"');
    expect(processed).toContain('![twitch](invalid-url)');
    expect(processed).toContain('<div class="bluesky-embed-container"');
    expect(processed).toContain('![youtube](https://youtu.be/)');
  });

  test('handles embeds with special characters in titles', () => {
    const content = '![youtube](https://youtu.be/abc123 "Test & Special < > \\" Characters")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('playlabel="Test &amp; Special &lt; &gt; &quot; Characters"');
  });
});