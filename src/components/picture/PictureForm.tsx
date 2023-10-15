import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FormEventHandler, useRef, useState } from 'react';
import useToast from '../../hooks/useToast';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { compressImage, uploadFile } from '../../utils/qiniu';
import { ProgressBar } from 'primereact/progressbar';

export type FormData = {
  name: string;
  storageKey: string;
  description: string;
};

type Props = {
  title: string;
  onFormSubmit: (e: FormData) => void;
  initData?: FormData;
  isPending: boolean;
};

type UploadProgress = {
  mode: 'determinate' | 'indeterminate';
  value: number;
};

function PictureForm({ title, onFormSubmit, isPending, initData }: Props) {
  const { error } = useToast();
  const uploadRef = useRef<FileUpload>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    value: 0,
    mode: 'indeterminate',
  });
  const [uploadDisable, setUploadDisable] = useState(false);
  const storageKeyRef = useRef<string>('');

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.picName.value;
    const storageKey = storageKeyRef.current;
    const description = form.description.value;

    if (!name) {
      error('图片名称不可为空');
      return;
    }

    if (!storageKey) {
      error('请上传文件');
      return;
    }

    onFormSubmit({ name, storageKey, description });
  };

  const startUpload = (file: File) => {
    uploadFile(file, (next) => {
      setUploadProgress({
        mode: 'determinate',
        value: Math.floor(next.total.percent),
      });
    })
      .then(
        (res) => {
          storageKeyRef.current = res.key;
        },
        (reason: Error) => {
          error(reason.message);
        }
      )
      .finally(() => {
        uploadRef.current?.clear();
        setUploadProgress({
          mode: 'indeterminate',
          value: 0,
        });
        setUploadDisable(false);
      });
  };

  const handleUploadImg = (e: FileUploadHandlerEvent) => {
    setUploadDisable(true);
    const file = e.files[0];
    compressImage(file).then(
      (data) => {
        startUpload(data);
      },
      (reason) => {
        console.error('图片压缩失败', reason);
        startUpload(file);
      }
    );
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <FileUpload
        ref={uploadRef}
        mode="basic"
        accept="image/*"
        maxFileSize={10000000}
        chooseOptions={{ label: '上传图片', icon: 'pi pi-cloud-upload' }}
        uploadHandler={handleUploadImg}
        auto
        customUpload
        disabled={uploadDisable}
      />
      {uploadDisable && <ProgressBar mode={uploadProgress.mode} value={uploadProgress.value} />}

      <form className="w-full space-y-10" onSubmit={handleFormSubmit}>
        <span className="p-float-label">
          <InputText
            required
            id="formName"
            name="picName"
            className="w-full"
            maxLength={64}
            defaultValue={initData?.name}
            autoFocus
          />
          <label htmlFor="formName">图片名称</label>
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

export default PictureForm;
