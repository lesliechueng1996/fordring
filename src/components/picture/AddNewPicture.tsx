import { useState } from 'react';
import PictureForm from './PictureForm';

function AddNewPicture() {
  const [isPending, setIsPending] = useState(false);

  return <PictureForm title="添加图片" isPending={isPending} onFormSubmit={() => {}} />;
}

export default AddNewPicture;
