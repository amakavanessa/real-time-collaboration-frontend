import { useContext } from "react";
import { EditorContext } from "../../../contexts/editor-context";
import { Editor } from "draft-js";
import "./draftEditor.css";
import useWindowSize from "../../../hooks/use-window-size";

const DocumentEditor = () => {
  const { widthStr, heightStr } = useWindowSize();

  const {
    editorState,
    editorRef,
    handleEditorChange,
    focusEditor,
    styleMap,
    myBlockStyleFn,
  } = useContext(EditorContext);

  return (
    <div
      style={{ height: heightStr, width: widthStr }}
      className="bg-white shadow-md flex-shrink-0 cursor-text p-12"
      onClick={focusEditor}
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={handleEditorChange}
        customStyleMap={styleMap}
        blockStyleFn={myBlockStyleFn}
      />
    </div>
  );
};
export default DocumentEditor;
