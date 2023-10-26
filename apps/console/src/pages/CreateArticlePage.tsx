import useSidebarAction from '../hooks/useSidebarAction';
import { Sidebar } from 'primereact/sidebar';
import useArticle from '../hooks/useArticle';
import CreateArticleProps from '../components/article/CreateArticleProps';
import ArticleForm, { Article } from '../components/article/ArticleForm';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveArticleReq } from '../apis/article-api';

function CreateArticlePage() {
  const { saveDraft, initArticle, save } = useArticle();
  const articleRef = useRef<Article>();
  const navigate = useNavigate();

  const {
    showSidebar: showPropsSidebar,
    showCreateSidebar: showPropsCreateSidebar,
    hideCreateSidebar: hidePropsCreateSidebar,
  } = useSidebarAction();

  const handleOnSave = async (article: SaveArticleReq) => {
    await save(article);
    navigate('/article/list');
  };

  return (
    <div className="h-full">
      <ArticleForm
        initArticle={initArticle}
        showSaveDraft
        onSave={(article) => {
          articleRef.current = article;
          showPropsCreateSidebar();
        }}
        onSaveDraft={saveDraft}
      />
      <Sidebar
        visible={showPropsSidebar.create}
        onHide={hidePropsCreateSidebar}
      >
        {articleRef.current && (
          <CreateArticleProps
            title={articleRef.current.title}
            content={articleRef.current.content}
            onSuccess={handleOnSave}
          />
        )}
      </Sidebar>
    </div>
  );
}

export default CreateArticlePage;
