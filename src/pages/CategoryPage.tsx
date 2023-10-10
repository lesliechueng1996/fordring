import { InputText } from 'primereact/inputtext';
import useCategory from '../hooks/useCategory';
import { FormEventHandler, useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import CreateCategory from '../components/category/CreateCategory';
import EditCategory from '../components/category/EditCategory';

function CategoryPage() {
  const { search, isLoading } = useCategory();
  const [showSidebar, setShowSidebar] = useState({
    create: false,
    edit: false,
  });

  const showCreateSidebar = () => setShowSidebar({ ...showSidebar, create: true });

  // const showEditSidebar = () => setShowSidebar({ ...showSidebar, edit: true });

  const hideCreateSidebar = () => setShowSidebar({ ...showSidebar, create: false });

  const hideEditSidebar = () => setShowSidebar({ ...showSidebar, edit: false });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <div>
      <div className="flex items-center gap-5">
        <form className="flex items-center gap-5" onSubmit={handleSubmit}>
          <span className="p-float-label">
            <InputText id="categoryName" name="categoryName" />
            <label htmlFor="categoryName">类别名</label>
          </span>
          <Button label="搜索" icon="pi pi-search" loading={isLoading} />
        </form>

        <Button label="新增" icon="pi pi-plus" severity="success" onClick={showCreateSidebar} />
      </div>
      <div></div>

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar}>
        <CreateCategory onSuccess={hideCreateSidebar} />
      </Sidebar>

      <Sidebar visible={showSidebar.edit} onHide={hideEditSidebar}>
        <EditCategory />
      </Sidebar>
    </div>
  );
}

export default CategoryPage;
