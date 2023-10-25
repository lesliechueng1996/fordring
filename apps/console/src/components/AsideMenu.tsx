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
        {
          label: '标签管理',
          icon: 'pi pi-tags',
          command: () => navigate('/tag'),
        },
        {
          label: '文章列表',
          icon: 'pi pi-list',
          command: () => navigate('/article/list'),
        },
        {
          label: '新建文章',
          icon: 'pi pi-file-edit',
          command: () => navigate('/article'),
        },
      ],
    },
    {
      label: '图片管理',
      items: [
        {
          label: '图册管理',
          icon: 'pi pi-images',
          command: () => navigate('/album'),
        },
      ],
    },
  ];

  return (
    <aside className="w-40 md:w-52 shrink-0">
      <Menu model={items} className="w-full h-full" />
    </aside>
  );
}

export default AsideMenu;
