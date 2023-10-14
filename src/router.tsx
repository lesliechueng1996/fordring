import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import AlbumPage from './pages/AlbumPage.tsx';

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
    ],
  },
]);

export default router;
