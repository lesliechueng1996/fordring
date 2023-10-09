import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';

function App() {
  const { isLogin } = useAuth();

  return <div>{isLogin() ? <div>123</div> : <LoginPage />}</div>;
}

export default App;
