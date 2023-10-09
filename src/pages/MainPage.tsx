import { Outlet } from 'react-router-dom';
import AsideMenu from '../components/AsideMenu';
import Header from '../components/Header';

function MainPage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <div className="grow flex">
        <AsideMenu />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainPage;
