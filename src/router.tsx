import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import AlbumPage from './pages/AlbumPage.tsx';
import AlbumPicturePage from './pages/AlbumPicturePage.tsx';
import TagPage from './pages/TagPage.tsx';

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
    ],
  },
]);

export default router;
