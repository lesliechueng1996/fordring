import { TabPanel, TabView } from 'primereact/tabview';
import PickExistingPic from './PickExistingPic';
import UploadPic from './UploadPic';

type PicInfo = { albumId: number; picId: number; url: string };

type Props = {
  onPicChoose: (picInfo: PicInfo) => void;
};

function PickPicture({ onPicChoose }: Props) {
  return (
    <TabView>
      <TabPanel header="上传图片">
        <UploadPic onSuccess={onPicChoose} />
      </TabPanel>
      <TabPanel header="选择图片">
        <PickExistingPic onSuccess={onPicChoose} />
      </TabPanel>
    </TabView>
  );
}

export default PickPicture;
