import { useParams } from 'react-router-dom';

function EditArticlePage() {
  const { articleId } = useParams();

  return <div>{articleId}</div>;
}

export default EditArticlePage;
