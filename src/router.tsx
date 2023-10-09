import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CategoryPage from './pages/CategoryPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'category',
        element: <CategoryPage />,
      },
    ],
  },
]);

export default router;
