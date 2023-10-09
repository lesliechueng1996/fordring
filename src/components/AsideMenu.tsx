import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

function AsideMenu() {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: '首页',
      icon: 'pi pi-microsoft',
      command: () => navigate('/'),
    },
    {
      label: '文章管理',
      items: [
        {
          label: '分类管理',
          icon: 'pi pi-th-large',
          command: () => navigate('/category'),
        },
      ],
    },
  ];

  return (
    <aside className="w-52 md:w-64">
      <Menu model={items} className="w-full h-full" />
    </aside>
  );
}

export default AsideMenu;
