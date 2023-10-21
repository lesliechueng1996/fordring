import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CategoryPage from './pages/CategoryPage';
import AlbumPage from './pages/AlbumPage';
import AlbumPicturePage from './pages/AlbumPicturePage';
import TagPage from './pages/TagPage';
import ArticlePage from './pages/ArticlePage';

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
        element: <ArticlePage />,
      },
    ],
  },
]);

export default router;
