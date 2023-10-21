import { useState } from 'react';

function useSidebarAction() {
  const [showSidebar, setShowSidebar] = useState({
    create: false,
    edit: false,
  });

  const showCreateSidebar = () => setShowSidebar({ ...showSidebar, create: true });

  const showEditSidebar = () => setShowSidebar({ ...showSidebar, edit: true });

  const hideCreateSidebar = () => setShowSidebar({ ...showSidebar, create: false });

  const hideEditSidebar = () => setShowSidebar({ ...showSidebar, edit: false });

  return {
    showSidebar,
    showCreateSidebar,
    showEditSidebar,
    hideCreateSidebar,
    hideEditSidebar,
  };
}

export default useSidebarAction;
