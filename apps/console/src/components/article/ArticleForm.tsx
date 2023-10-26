import MDEditor, {
  ExecuteState,
  TextAreaTextApi,
  commands,
} from '@uiw/react-md-editor';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useMemo, useRef, useState } from 'react';
import useToast from '../../hooks/useToast';
import useSidebarAction from '../../hooks/useSidebarAction';
import rehypeSanitize from 'rehype-sanitize';
import { Sidebar } from 'primereact/sidebar';
import PickPicture from './PickPicture';
import { ARTICLE_IMAGE_PREFIX } from '../../configs/constant';

export type Article = {
  title: string;
  content: string;
};

type Props = {
  initArticle?: Article;
  showSaveDraft: boolean;
  onSave: (article: Article) => void;
  onSaveDraft?: (article: Article) => void;
};

function ArticleForm({
  initArticle,
  showSaveDraft,
  onSave,
  onSaveDraft,
}: Props) {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
  });
  const {
    showSidebar: showPicSidebar,
    showCreateSidebar: showPicCreateSidebar,
    hideCreateSidebar: hidePicCreateSidebar,
  } = useSidebarAction();
  const { error } = useToast();
  const editorApiRef = useRef<TextAreaTextApi>();
  useEffect(() => {
    if (initArticle) {
      setArticle(initArticle);
    }
  }, [initArticle]);

  const customCommand = useMemo(
    () =>
      commands.getCommands().map((cmd) => {
        if (cmd.keyCommand === 'image') {
          return {
            ...cmd,
            execute: (_: ExecuteState, api: TextAreaTextApi) => {
              showPicCreateSidebar();
              editorApiRef.current = api;
            },
          };
        } else {
          return cmd;
        }
      }),
    [showPicCreateSidebar]
  );

  const setTitle = (title: string) => {
    setArticle({
      ...article,
      title,
    });
  };

  const setContent = (content: string) => {
    setArticle({
      ...article,
      content,
    });
  };

  const validateInput = () => {
    const { title, content } = article;
    if (!title) {
      error('请输入标题');
      return false;
    }
    if (!content) {
      error('请输入内容');
      return false;
    }
    return true;
  };

  const handleSaveArticle = () => {
    if (!validateInput()) {
      return;
    }
    onSave(article);
  };

  return (
    <div className="flex gap-10 flex-col h-full">
      <div className="flex gap-5 shrink-0">
        <InputText
          placeholder="标题"
          className="grow"
          value={article.title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={128}
        />
        {showSaveDraft && (
          <Button
            label="保存草稿"
            className="shrink-0"
            onClick={() => {
              if (!validateInput()) {
                return;
              }
              onSaveDraft && onSaveDraft(article);
            }}
          />
        )}

        <Button
          label="保存"
          icon="pi pi-save"
          severity="success"
          className="shrink-0"
          onClick={handleSaveArticle}
        />
      </div>
      <div className="grow">
        <MDEditor
          height="100%"
          visibleDragbar={false}
          value={article.content}
          onChange={(v) => setContent(v ?? '')}
          commands={customCommand}
          previewOptions={{
            rehypePlugins: [rehypeSanitize],
          }}
        />
      </div>

      <Sidebar
        visible={showPicSidebar.create}
        onHide={hidePicCreateSidebar}
        className="w-1/4"
      >
        <PickPicture
          onPicChoose={({ picId, url }) => {
            editorApiRef.current?.replaceSelection(
              `![${ARTICLE_IMAGE_PREFIX}${picId}](${url})`
            );
            hidePicCreateSidebar();
          }}
        />
      </Sidebar>
    </div>
  );
}

export default ArticleForm;
