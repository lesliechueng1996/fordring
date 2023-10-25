import MDEditor, {
  ExecuteState,
  TextAreaTextApi,
  commands,
} from '@uiw/react-md-editor';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useMemo, useRef } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import useSidebarAction from '../hooks/useSidebarAction';
import { Sidebar } from 'primereact/sidebar';
import PickPicture from '../components/article/PickPicture';
import useArticle from '../hooks/useArticle';
import { ARTICLE_IMAGE_PREFIX } from '../configs/constant';
import CreateArticleProps from '../components/article/CreateArticleProps';

function CreateArticlePage() {
  const { title, content, setTitle, setContent, saveDraft, validateInput } =
    useArticle();
  const {
    showSidebar: showPicSidebar,
    showCreateSidebar: showPicCreateSidebar,
    hideCreateSidebar: hidePicCreateSidebar,
  } = useSidebarAction();
  const {
    showSidebar: showPropsSidebar,
    showCreateSidebar: showPropsCreateSidebar,
    hideCreateSidebar: hidePropsCreateSidebar,
  } = useSidebarAction();
  const editorApiRef = useRef<TextAreaTextApi>();

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

  return (
    <div className="flex gap-10 flex-col h-full">
      <div className="flex gap-5 shrink-0">
        <InputText
          placeholder="标题"
          className="grow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={128}
        />
        <Button label="保存草稿" className="shrink-0" onClick={saveDraft} />
        <Button
          label="保存"
          icon="pi pi-save"
          severity="success"
          className="shrink-0"
          onClick={() => validateInput() && showPropsCreateSidebar()}
        />
      </div>
      <div className="grow">
        <MDEditor
          height="100%"
          visibleDragbar={false}
          value={content}
          onChange={(v) => setContent(v ?? '')}
          commands={customCommand}
          previewOptions={{
            rehypePlugins: [rehypeSanitize],
          }}
        />
      </div>

      <Sidebar
        visible={showPropsSidebar.create}
        onHide={hidePropsCreateSidebar}
      >
        <CreateArticleProps
          title={title}
          content={content}
          onSuccess={(id: string) => {
            console.log(id);
            // TODO jump to list page
            hidePropsCreateSidebar();
          }}
        />
      </Sidebar>

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

export default CreateArticlePage;
