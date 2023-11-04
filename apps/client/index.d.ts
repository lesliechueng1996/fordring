/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

type ArticlePageResponse = {
  nextId: string | null;
  articles: {
    title: string;
    category: {
      id: number;
      categoryName: string;
    } | null;
    id: string;
    updateTime: number;
    content: string;
    previewUrl: string | null;
    author: string;
    tags: {
      id: number;
      color: string;
      tagName: string;
    }[];
  }[];
};
