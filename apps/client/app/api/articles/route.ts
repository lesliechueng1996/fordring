import { type NextRequest } from 'next/server';
import { getArticleForPage } from '@/repositories/ArticleRepository';
import isNumber from '@/utils/isNumber';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const label = query.get('label');
  const lastId = query.get('lastId');

  if (lastId === null || label === null || !isNumber(Number(label))) {
    return new Response('Bad Request', { status: 400 });
  }

  const categoryId = label === '' ? null : Number(label);

  const articles = await getArticleForPage(categoryId, lastId, 6);
  let nextLastId: string | null = null;
  if (articles.length > 0) {
    nextLastId = articles[articles.length - 1].id;
  }

  const result: ArticlePageResponse = {
    articles: articles.map((article) => ({
      ...article,
      updateTime: article.updateTime.getTime(),
    })),
    nextId: nextLastId,
  };
  return Response.json(result);
}
