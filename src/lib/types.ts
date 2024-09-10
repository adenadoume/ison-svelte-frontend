export interface Page {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  slug: string;
  _embedded: {
    'wp:term': Category[][];
  };
}

export interface HomeData {
  pages: Page[];
  posts: Post[];
}