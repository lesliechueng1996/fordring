import { useRef } from 'react';
import ArticleForm, { Article } from '../components/article/ArticleForm';
import useEditArticle from '../hooks/useEditArticle';
import useSidebarAction from '../hooks/useSidebarAction';
import { Sidebar } from 'primereact/sidebar';
import EditArticleProps from '../components/article/EditArticleProps';
import { SaveArticleReq } from '../apis/article-api';

function EditArticlePage() {
  const { editArticle, save } = useEditArticle();
  const { title = '', content = '' } = editArticle || {};
  const articleRef = useRef<Article>();

  const { showSidebar, showEditSidebar, hideEditSidebar } = useSidebarAction();

  const handleOnSave = async (
    data: Omit<SaveArticleReq, 'title' | 'content'>
  ) => {
    if (!editArticle || !articleRef.current) {
      return;
    }
    save({
      ...data,
      ...articleRef.current,
      version: editArticle.version,
    });
  };

  return (
    <div className="h-full">
      {editArticle && (
        <>
          <ArticleForm
            initArticle={{
              title,
              content,
            }}
            showSaveDraft={false}
            onSave={(article) => {
              articleRef.current = article;
              showEditSidebar();
            }}
          />
          <Sidebar visible={showSidebar.edit} onHide={hideEditSidebar}>
            <EditArticleProps
              onSuccess={handleOnSave}
              initData={{
                ...editArticle,
                previewUrl: editArticle.previewUrl || '',
                tagIds: editArticle.tags,
              }}
            />
          </Sidebar>
        </>
      )}
    </div>
  );
}

export default EditArticlePage;
