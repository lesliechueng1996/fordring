import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import AlbumPage from './pages/AlbumPage.tsx';
import AlbumPicturePage from './pages/AlbumPicturePage.tsx';

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
    ],
  },
]);

export default router;
