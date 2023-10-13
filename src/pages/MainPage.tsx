import { Outlet } from 'react-router-dom';
import AsideMenu from '../components/AsideMenu';
import Header from '../components/Header';

function MainPage() {
  console.log('MainPage render');

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <div className="grow flex">
        <AsideMenu />
        <main className="p-5 grow">
          <div className="shadow h-full border rounded-md p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
