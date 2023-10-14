import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import useToast from '../../hooks/useToast';
import { FormEventHandler } from 'react';
import isHttpUrl from '../../utils/isHttpUrl';

export type FormData = {
  displayName: string;
  folderName: string;
  previewUrl: string;
  description: string;
};

type Props = {
  title: string;
  onFormSubmit: (e: FormData) => void;
  initData?: FormData;
  isPending: boolean;
};

function AlbumForm({ title, onFormSubmit, isPending, initData }: Props) {
  const { error } = useToast();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const displayName = form.displayName.value;
    const folderName = form.folderName.value;
    const previewUrl = form.previewUrl.value;
    const description = form.description.value;

    if (!displayName) {
      error('图册名称不可为空');
      return;
    }

    if (!folderName) {
      error('图册文件夹路径不可为空');
      return;
    }

    if (!/^[^./]*$/.test(folderName)) {
      error('图册文件夹路径不可包含 . 或 /');
      return;
    }

    if (previewUrl && !isHttpUrl(previewUrl)) {
      error('预览图片地址不合法');
      return;
    }

    onFormSubmit({ displayName, folderName, previewUrl, description });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <form className="w-full space-y-10" onSubmit={handleFormSubmit}>
        <span className="p-float-label">
          <InputText
            required
            id="formDisplayName"
            name="displayName"
            className="w-full"
            maxLength={16}
            defaultValue={initData?.displayName}
            autoFocus
          />
          <label htmlFor="formDisplayName">图册名称</label>
        </span>

        <span className="p-float-label">
          <InputText
            required
            id="formFolderName"
            name="folderName"
            className="w-full"
            maxLength={32}
            defaultValue={initData?.folderName}
          />
          <label htmlFor="formFolderName">图册文件夹路径</label>
        </span>

        <span className="p-float-label">
          <InputText id="formPreviewUrl" name="previewUrl" className="w-full" defaultValue={initData?.previewUrl} />
          <label htmlFor="formPreviewUrl">预览图片地址</label>
        </span>

        <span className="p-float-label">
          <InputTextarea
            id="formDescription"
            name="description"
            className="w-full resize-none"
            maxLength={256}
            defaultValue={initData?.description}
          />
          <label htmlFor="formDescription">描述</label>
        </span>

        <Button label="保存" icon="pi pi-check" loading={isPending} className="w-full" />
      </form>
    </div>
  );
}

export default AlbumForm;
