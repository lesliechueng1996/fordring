import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FormEventHandler } from 'react';

type FormData = {
  categoryName: string;
};

type Props = {
  title: string;
  submitText: string;
  initData: FormData;
  isPending: boolean;
  onFormSubmit: FormEventHandler<HTMLFormElement>;
};

function CategoryForm({ title, submitText, initData, isPending, onFormSubmit }: Props) {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <form
        className="w-full space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          onFormSubmit(e);
        }}
      >
        <span className="p-float-label">
          <InputText
            required
            id="formCategoryName"
            name="categoryName"
            className="w-full"
            maxLength={32}
            defaultValue={initData.categoryName}
            autoFocus
          />
          <label htmlFor="formCategoryName">类别名</label>
        </span>
        <Button label={submitText} icon="pi pi-check" loading={isPending} className="w-full" />
      </form>
    </div>
  );
}

export default CategoryForm;
