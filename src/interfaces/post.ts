export type PostType = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: {
    name: string;
    picture: string;
  };
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  category: string;
};
