import MDEditor, { ExecuteState, TextAreaTextApi, commands } from '@uiw/react-md-editor';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useMemo, useRef } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import useSidebarAction from '../hooks/useSidebarAction';
import { Sidebar } from 'primereact/sidebar';
import PickPicture from '../components/article/PickPicture';
import useArticle from '../hooks/useArticle';
import { ARTICLE_IMAGE_PREFIX } from '../configs/constant';

function ArticlePage() {
  const { title, content, setTitle, setContent, saveDraft } = useArticle();
  const { showSidebar, showCreateSidebar, hideCreateSidebar } = useSidebarAction();
  const editorApiRef = useRef<TextAreaTextApi>();

  const customCommand = useMemo(
    () =>
      commands.getCommands().map((cmd) => {
        if (cmd.keyCommand === 'image') {
          return {
            ...cmd,
            execute: (_: ExecuteState, api: TextAreaTextApi) => {
              showCreateSidebar();
              editorApiRef.current = api;
            },
          };
        } else {
          return cmd;
        }
      }),
    [showCreateSidebar]
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
        <Button label="保存" icon="pi pi-save" severity="success" className="shrink-0" />
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

      <Sidebar visible={showSidebar.create} onHide={hideCreateSidebar} className="w-1/4">
        <PickPicture
          onPicChoose={({ picId, url }) => {
            editorApiRef.current?.replaceSelection(`![${ARTICLE_IMAGE_PREFIX}${picId}](${url})`);
            hideCreateSidebar();
          }}
        />
      </Sidebar>
    </div>
  );
}

export default ArticlePage;
