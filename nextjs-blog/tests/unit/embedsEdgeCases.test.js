/**
 * @jest-environment jsdom
 */

import { processEmbeds } from '../../lib/posts';

describe('Embeds Edge Cases', () => {
  test('handles malformed YouTube URLs', () => {
    const testCases = [
      '![youtube](invalid-url)',
      '![youtube](https://youtube.com/invalid)',
      '![youtube](https://youtube.com/watch?v=)',
      '![youtube](https://youtu.be/)',
      '![youtube](https://youtu.be/123)' // Too short video ID
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles malformed Twitch URLs', () => {
    const testCases = [
      '![twitch](invalid-url)',
      '![twitch](https://twitch.tv)',
      '![twitch](https://twitch.tv/)',
      '![twitch]()'
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles malformed Bluesky URLs', () => {
    const testCases = [
      '![bluesky](invalid-url)',
      '![bluesky](https://bsky.app)',
      '![bluesky](https://bsky.app/profile)',
      '![bluesky](https://bsky.app/profile/user)',
      '![bluesky](https://bsky.app/profile/user/)'
    ];

    testCases.forEach(content => {
      const processed = processEmbeds(content);
      expect(processed).toBe(content);
    });
  });

  test('handles YouTube options in title', () => {
    const content = '![youtube](https://youtu.be/abc1234 "Video Title|start=30,autoplay=true")';
    const processed = processEmbeds(content);
    
    expect(processed).toContain('start="30"');
    expect(processed).toContain('autoplay="true"');
    expect(processed).toContain('playlabel="Video Title"');
  });

  test('escapes HTML entities in YouTube titles', () => {
    const testCases = [
      {
        input: '![youtube](https://youtu.be/abc1234 "Test & Video")',
        expected: 'playlabel="Test &amp; Video"'
      },
      {
        input: '![youtube](https://youtu.be/abc1234 "Test < Video")',
        expected: 'playlabel="Test &lt; Video"'
      },
      {
        input: '![youtube](https://youtu.be/abc1234 "Test > Video")',
        expected: 'playlabel="Test &gt; Video"'
      },
      {
        input: '![youtube](https://youtu.be/abc1234 "Test \\" Video")',
        expected: 'playlabel="Test &quot; Video"'
      }
    ];

    testCases.forEach(({ input, expected }) => {
      const processed = processEmbeds(input);
      expect(processed).toContain(expected);
    });
  });

  test('handles mixed content with some invalid embeds', () => {
    const content = `# Test Post
![youtube](https://youtu.be/valid123 "Valid Video")
![twitch](invalid-url)
Some text
![bluesky](https://bsky.app/profile/user/post/valid456)
![youtube](https://youtu.be/)`;

    const processed = processEmbeds(content);

    expect(processed).toContain('videoid="valid123"');
    expect(processed).toContain('profile/user/post/valid456');
    expect(processed).toContain('![twitch](invalid-url)');
    expect(processed).toContain('![youtube](https://youtu.be/)');
  });

  test('preserves surrounding content', () => {
    const content = `# Heading
Before embed
![youtube](https://youtu.be/abc1234 "Test Video")
After embed`;

    const processed = processEmbeds(content);
    expect(processed).toContain('# Heading');
    expect(processed).toContain('Before embed');
    expect(processed).toContain('After embed');
  });
});