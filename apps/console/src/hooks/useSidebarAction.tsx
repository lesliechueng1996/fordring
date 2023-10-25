import { useCallback, useState } from 'react';

function useSidebarAction() {
  const [showSidebar, setShowSidebar] = useState({
    create: false,
    edit: false,
  });

  const showCreateSidebar = useCallback(
    () => setShowSidebar((state) => ({ ...state, create: true })),
    [setShowSidebar]
  );

  const showEditSidebar = useCallback(
    () => setShowSidebar((state) => ({ ...state, edit: true })),
    [setShowSidebar]
  );

  const hideCreateSidebar = useCallback(
    () => setShowSidebar((state) => ({ ...state, create: false })),
    [setShowSidebar]
  );

  const hideEditSidebar = useCallback(
    () => setShowSidebar((state) => ({ ...state, edit: false })),
    [setShowSidebar]
  );

  return {
    showSidebar,
    showCreateSidebar,
    showEditSidebar,
    hideCreateSidebar,
    hideEditSidebar,
  };
}

export default useSidebarAction;
