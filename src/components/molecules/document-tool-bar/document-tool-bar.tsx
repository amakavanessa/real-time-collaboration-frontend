import { RichUtils } from "draft-js";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaTextWidth,
  FaUnderline,
} from "react-icons/fa";
import {
  TbLetterCase,
  TbLetterCaseLower,
  TbLetterCaseUpper,
} from "react-icons/tb";

const DocumentToolbar = ({ editorState, setEditorState }) => {
  const tools = [
    {
      label: "Bold",
      style: "BOLD",
      icon: <FaBold />,
      method: "inline",
    },
    {
      label: "Italic",
      style: "ITALIC",
      icon: <FaItalic />,
      method: "inline",
    },
    {
      label: "Underline",
      style: "UNDERLINE",
      icon: <FaUnderline />,
      method: "inline",
    },
    {
      label: "Highlight",
      style: "HIGHLIGHT",
      icon: <FaHighlighter />,
      method: "inline",
    },
    {
      label: "Strike-through",
      style: "STRIKETHROUGH",
      icon: <FaStrikethrough />,
      method: "inline",
    },
    {
      label: "Superscript",
      style: "SUPERSCRIPT",
      icon: <FaSuperscript width={24} height={24} />,
      method: "inline",
    },
    {
      label: "Subscript",
      style: "SUBSCRIPT",
      icon: <FaSubscript />,
      method: "inline",
    },
    {
      label: "Monospace",
      style: "CODE",
      icon: <FaTextWidth />,
      method: "inline",
    },
    {
      label: "Blockquote",
      style: "blockQuote",
      icon: <FaQuoteRight />,
      method: "block",
    },
    {
      label: "Unordered-List",
      style: "unordered-list-item",
      method: "block",
      icon: <FaListUl />,
    },
    {
      label: "Ordered-List",
      style: "ordered-list-item",
      method: "block",
      icon: <FaListOl />,
    },
    {
      label: "Code Block",
      style: "CODEBLOCK",
      icon: <FaCode />,
      method: "inline",
    },
    {
      label: "Lowercase",
      style: "LOWERCASE",
      icon: <TbLetterCaseLower />,
      method: "inline",
    },
    {
      label: "Capitalize",
      style: "CAPITALIZE",
      icon: <TbLetterCase />,
      method: "inline",
    },
    {
      label: "Uppercase",
      style: "UPPERCASE",
      icon: <TbLetterCaseUpper />,
      method: "inline",
    },

    {
      label: "Left",
      style: "leftAlign",
      icon: <FaAlignLeft />,
      method: "block",
    },
    {
      label: "Center",
      style: "centerAlign",
      icon: <FaAlignCenter />,
      method: "block",
    },
    {
      label: "Right",
      style: "rightAlign",
      icon: <FaAlignRight />,
      method: "block",
    },
    {
      label: "Justify",
      style: "justifyAlign",
      icon: <FaAlignJustify />,
      method: "block",
    },
    { label: "H1", style: "header-one", method: "block" },
    { label: "H2", style: "header-two", method: "block" },
    { label: "H3", style: "header-three", method: "block" },
    { label: "H4", style: "header-four", method: "block" },
    { label: "H5", style: "header-five", method: "block" },
    { label: "H6", style: "header-six", method: "block" },
  ];

  const applyStyle = (e, style, method) => {
    e.preventDefault();
    method === "block"
      ? setEditorState(RichUtils.toggleBlockType(editorState, style))
      : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isActive = (style, method) => {
    if (method === "block") {
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      return blockType === style;
    } else {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    }
  };

  return (
    <div className="toolbar-grid">
      {tools.map((item, idx) => (
        <button
          className="editor-btn mr-2 text-[1rem] p-2.5 border-0 bg-white cursor-pointer"
          style={{
            color: isActive(item.style, item.method)
              ? "rgba(0, 0, 0, 1)"
              : "rgba(0, 0, 0, 0.3)",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  );
};

export default DocumentToolbar;
