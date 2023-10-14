import { Avatar } from 'primereact/avatar';
import useAuth from '../hooks/useAuth';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { logout } from '../apis/auth-api';

function Header() {
  const { avatarUrl, nickName, clearTokenStore, accessToken } = useAuth();
  const userMenu = useRef<Menu>(null);

  const options = [
    {
      label: '登出',
      icon: 'pi pi-sign-out',
      command: () => {
        if (accessToken) {
          logout(accessToken);
        }
        clearTokenStore();
      },
    },
  ];

  return (
    <header className="h-16 shadow flex justify-between items-center px-5 shrink-0">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" />
        <span className="text-xl font-bold">Fordring Blog Console</span>
      </div>
      <div>
        <Menu model={options} popup ref={userMenu} className="w-36" />
        {avatarUrl ? (
          <Avatar
            image={avatarUrl}
            className="cursor-pointer"
            size="large"
            shape="circle"
            onClick={(e) => userMenu.current!.toggle(e)}
          />
        ) : (
          <Avatar
            label={nickName?.charAt(0) || 'U'}
            size="large"
            shape="circle"
            className="cursor-pointer"
            onClick={(e) => userMenu.current!.toggle(e)}
            style={{ backgroundColor: '#4caf4f', color: '#ffffff' }}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
