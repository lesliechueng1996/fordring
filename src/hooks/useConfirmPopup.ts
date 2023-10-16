import { confirmPopup } from 'primereact/confirmpopup';

function useConfirmPopup() {
  const showConfirm = (target: HTMLElement, onAccept: () => void) => {
    confirmPopup({
      target,
      message: '是否确认删除?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: '删除',
      rejectLabel: '取消',
      accept: () => {
        onAccept();
      },
    });
  };

  return showConfirm;
}

export default useConfirmPopup;
