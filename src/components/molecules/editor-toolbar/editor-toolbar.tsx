import { useContext } from "react";
import { EditorContext } from "../../../contexts/editor-context";
import { EditorState } from "draft-js";
import IconButton from "../../atoms/icon-button/icon-button";
import FontSelect from "../../atoms/font-select";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import FontSize from "../../atoms/font-size/font-size";

const EditorToolbar = () => {
  const { editorState, setEditorState } = useContext(EditorContext);

  const handleUndoBtnClick = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const handleRedoBtnClick = () => {
    setEditorState(EditorState.redo(editorState));
  };

  return (
    <div className="w-full h-9 px-3 py-1 flex-shrink-0 flex items-center">
      <IconButton
        onClick={handleUndoBtnClick}
        icon={<TiArrowBack className="h-4 w-4" />}
        tooltip="Undo"
      />
      <IconButton
        onClick={handleRedoBtnClick}
        icon={<TiArrowForward className="h-4 w-4" />}
        tooltip="Redo"
      />
      <div className="h-5 border-l border-l-gray-300 mx-2"></div>
      <FontSelect />
      <FontSize />
    </div>
  );
};

export default EditorToolbar;
