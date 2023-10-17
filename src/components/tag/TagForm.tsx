import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { FormEventHandler, useState } from 'react';
import useToast from '../../hooks/useToast';

export type FormData = {
  tagName: string;
  color: string;
};

type Props = {
  title: string;
  submitText: string;
  initData?: FormData;
  isPending: boolean;
  onFormSubmit: (data: FormData) => void;
};

const DEFAULT_COLOR = '00C4FF';

function TagForm({ title, submitText, initData, isPending, onFormSubmit }: Props) {
  const [color, setColor] = useState<string>(initData?.color ?? DEFAULT_COLOR);
  const { error } = useToast();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const tagName = form.tagNameInput.value;

    if (!tagName) {
      error('标签名不能为空');
      return;
    }

    if (!color) {
      error('颜色不能为空');
      return;
    }

    onFormSubmit({ tagName, color });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <form className="w-full space-y-5" onSubmit={handleFormSubmit}>
        <span className="p-float-label">
          <InputText
            required
            id="formTagName"
            name="tagNameInput"
            className="w-full"
            maxLength={32}
            defaultValue={initData?.tagName}
            autoFocus
          />
          <label htmlFor="formTagName">标签名</label>
        </span>

        <div className="flex gap-5 items-center">
          <span>背景颜色</span>
          <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value as string)} />
        </div>

        <Button label={submitText} icon="pi pi-check" loading={isPending} className="w-full" />
      </form>
    </div>
  );
}

export default TagForm;
