import {
  getSortedPostsData,
  getPostData,
  getAllPostIds,
  getAllCategories,
  getPostsByCategorySlug,
  getCategoryFromSlug
} from '../../lib/posts';
import fs from 'fs';
import matter from 'gray-matter';

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

jest.mock('gray-matter', () => jest.fn());

describe('Posts Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSortedPostsData error handling', () => {
    test('handles filesystem errors', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSortedPostsData();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });

    test('handles invalid file content', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockReturnValue('Invalid content');
      matter.mockImplementation(() => {
        throw new Error('Invalid frontmatter');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSortedPostsData();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getPostData error handling', () => {
    test('handles missing file', async () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(getPostData('nonexistent')).rejects.toThrow('File not found');
    });

    test('handles invalid markdown content', async () => {
      fs.readFileSync.mockReturnValue('Invalid markdown');
      matter.mockImplementation(() => {
        throw new Error('Invalid frontmatter');
      });

      await expect(getPostData('invalid')).rejects.toThrow('Invalid frontmatter');
    });
  });

  describe('getAllPostIds error handling', () => {
    test('handles directory read error', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getAllPostIds();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getAllCategories error handling', () => {
    test('handles file read errors', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getAllCategories();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });

    test('handles invalid category data', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockReturnValue('---\ncategory: [invalid]\n---');
      matter.mockImplementation(() => {
        throw new Error('Invalid category data');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getAllCategories();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getPostsByCategorySlug error handling', () => {
    test('handles invalid category slug', () => {
      const result = getPostsByCategorySlug('nonexistent');
      expect(result).toEqual([]);
    });

    test('handles file read errors', () => {
      fs.readdirSync.mockReturnValue(['post.md']);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getPostsByCategorySlug('valid-slug');
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getCategoryFromSlug error handling', () => {
    test('handles null slug', () => {
      const result = getCategoryFromSlug(null);
      expect(result).toBeNull();
    });

    test('handles file system errors', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = getCategoryFromSlug('valid-slug');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});