import { getSortedPostsData, getAllPostIds } from '../../lib/posts';

// Mock du module fs pour éviter de lire les fichiers réels pendant les tests
jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['test-post.md']),
  readFileSync: jest.fn().mockReturnValue(`---
title: "Test Post"
date: "2025-01-01"
excerpt: "This is a test post"
categories: ["Test"]
---

This is test content.`),
}));

// Mock de path.join pour éviter les problèmes de chemins
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
}));

describe('Posts Library', () => {
  test('getSortedPostsData returns sorted posts data', () => {
    const posts = getSortedPostsData();
    expect(posts).toHaveLength(1);
    expect(posts[0]).toHaveProperty('id', 'test-post');
    expect(posts[0]).toHaveProperty('title', 'Test Post');
    expect(posts[0]).toHaveProperty('date', '2025-01-01');
  });

  test('getAllPostIds returns formatted post ids', () => {
    const ids = getAllPostIds();
    expect(ids).toHaveLength(1);
    expect(ids[0]).toHaveProperty('params');
    expect(ids[0].params).toHaveProperty('id', 'test-post');
  });
});
