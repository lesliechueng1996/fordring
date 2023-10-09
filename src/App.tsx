import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

function App() {
  const { isLogin } = useAuth();

  return <div>{isLogin() ? <MainPage /> : <LoginPage />}</div>;
}

export default App;
