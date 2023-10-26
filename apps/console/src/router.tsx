import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CategoryPage from './pages/CategoryPage';
import AlbumPage from './pages/AlbumPage';
import AlbumPicturePage from './pages/AlbumPicturePage';
import TagPage from './pages/TagPage';
import CreateArticlePage from './pages/CreateArticlePage';
import ArticlePage from './pages/ArticlePage';
import EditArticlePage from './pages/EditArticlePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'category',
        element: <CategoryPage />,
      },
      {
        path: 'album',
        element: <AlbumPage />,
      },
      {
        path: 'album/:albumId/picture',
        element: <AlbumPicturePage />,
      },
      {
        path: 'tag',
        element: <TagPage />,
      },
      {
        path: 'article',
        element: <CreateArticlePage />,
      },
      {
        path: 'article/list',
        element: <ArticlePage />,
      },
      {
        path: 'article/:articleId',
        element: <EditArticlePage />,
      },
    ],
  },
]);

export default router;
