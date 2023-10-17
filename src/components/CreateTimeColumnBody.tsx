import toDateString from '../utils/toDateString';

function CreateTimeColumnBody(rowData: { createTime: number }) {
  return <span>{toDateString(rowData.createTime)}</span>;
}

export default CreateTimeColumnBody;
