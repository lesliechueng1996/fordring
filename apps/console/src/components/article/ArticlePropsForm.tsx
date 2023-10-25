import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { FormEventHandler, useState } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import useCategoryOptions from '../../hooks/useCategoryOptions';
import useTagOptions from '../../hooks/useTagOptions';

export type FormData = {
  status: boolean;
  categoryId: string;
  previewUrl: string;
  isTop: boolean;
  isFire: boolean;
  tagIds: string[];
};

type Props = {
  title: string;
  onFormSubmit: (e: FormData) => void;
  initData?: FormData;
  isPending: boolean;
};

type OnFormChange<T extends keyof FormData> = (
  key: T
) => (e: { value: FormData[T] }) => void;

function ArticlePropsForm({ title, onFormSubmit, isPending, initData }: Props) {
  const [data, setData] = useState<Omit<FormData, 'previewUrl'>>(() => {
    return {
      status: initData?.status ?? true,
      categoryId: initData?.categoryId ?? '',
      isTop: initData?.isTop ?? false,
      isFire: initData?.isFire ?? false,
      tagIds: initData?.tagIds ?? [],
    };
  });
  const { categoryOptions } = useCategoryOptions({
    label: '无',
    value: '',
  });
  const { tagOptions } = useTagOptions();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const previewUrl = form.previewUrl.value;
    onFormSubmit({
      ...data,
      previewUrl,
    });
  };

  const onFormChange: OnFormChange<keyof FormData> = (key) => (e) => {
    setData((v) => ({ ...v, [key]: e.value }));
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <form className="w-full space-y-10" onSubmit={handleFormSubmit}>
        {/* 文章状态 */}
        <div className="flex items-center gap-3">
          <span>是否显示</span>
          <InputSwitch
            checked={data.status}
            onChange={onFormChange('status')}
          />
        </div>

        {/* 文章分类 */}
        <div>
          <Dropdown
            value={data.categoryId}
            options={categoryOptions}
            placeholder="选择分类"
            className="w-full"
            onChange={onFormChange('categoryId')}
          />
        </div>

        {/* 预览图片 */}
        <div className="p-float-label">
          <InputText
            id="formPreviewUrl"
            name="previewUrl"
            className="w-full"
            maxLength={256}
            defaultValue={initData?.previewUrl ?? ''}
          />
          <label htmlFor="formPreviewUrl">预览图片URL</label>
        </div>

        {/* 是否置顶 */}
        <div className="flex items-center gap-3">
          <span>是否置顶</span>
          <InputSwitch checked={data.isTop} onChange={onFormChange('isTop')} />
        </div>

        {/* 是否精华 */}
        <div className="flex items-center gap-3">
          <span>是否精华</span>
          <InputSwitch
            checked={data.isFire}
            onChange={onFormChange('isFire')}
          />
        </div>

        {/* 标签 */}
        <MultiSelect
          value={data.tagIds}
          onChange={onFormChange('tagIds')}
          options={tagOptions}
          optionValue="value"
          placeholder="选择标签"
          className="w-full"
        />

        <Button
          label="保存"
          icon="pi pi-check"
          loading={isPending}
          className="w-full"
        />
      </form>
    </div>
  );
}

export default ArticlePropsForm;
