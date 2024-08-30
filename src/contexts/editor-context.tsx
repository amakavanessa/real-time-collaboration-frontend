import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  convertFromRaw,
  convertToRaw,
  DraftStyleMap,
  Editor,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { FONTS } from "../components/atoms/font-select";
import { DocumentContext } from "./document-context";
import { ToastContext } from "./toast-context";
import useAuth from "../hooks/use-auth";
import SocketEvent from "../types/enums/socket-events-enum";
import DocumentInterface from "../types/interfaces/document";
import { BASE_URL } from "../services/api";
import { io } from "socket.io-client";

interface EditorContextInterface {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  socket: null | MutableRefObject<any>;
  documentRendered: boolean;
  setDocumentRendered: Dispatch<SetStateAction<boolean>>;
  editorRef: null | MutableRefObject<null | Editor>;
  handleEditorChange: (editorState: EditorState) => void;
  focusEditor: () => void;
  currentFont: string;
  setCurrentFont: Dispatch<SetStateAction<string>>;
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
  styleMap: DraftStyleMap;
  myBlockStyleFn: (contentBlock: any) => string | undefined;
}

const defaultValues = {
  editorState: EditorState.createEmpty(),
  setEditorState: () => {},
  socket: null,
  documentRendered: false,
  setDocumentRendered: () => {},
  editorRef: null,
  handleEditorChange: () => {},
  focusEditor: () => {},
  currentFont: FONTS[0],
  setCurrentFont: () => {},
  fontSize: 14,
  setFontSize: () => {},
  styleMap: {},
  myBlockStyleFn: (contentBlock: any) => undefined,
};

export const EditorContext =
  createContext<EditorContextInterface>(defaultValues);

interface EditorProviderInterface {
  children: JSX.Element;
}

const DEFAULT_SAVE_TIME = 1500;
let saveInterval: null | NodeJS.Timeout = null;

export const EditorProvider = ({ children }: EditorProviderInterface) => {
  const [editorState, setEditorState] = useState(defaultValues.editorState);
  const socket = useRef<any>(defaultValues.socket);
  const [documentRendered, setDocumentRendered] = useState(
    defaultValues.documentRendered
  );
  const editorRef = useRef<null | Editor>(defaultValues.editorRef);
  const [currentFont, setCurrentFont] = useState(defaultValues.currentFont);
  const [fontSize, setFontSize] = useState(defaultValues.fontSize);

  const { document, setCurrentUsers, setSaving, setDocument, saveDocument } =
    useContext(DocumentContext);
  const { error } = useContext(ToastContext);
  const { accessToken } = useAuth();

  const focusEditor = () => {
    if (editorRef === null || editorRef.current === null) return;

    editorRef.current.focus();
  };

  // Send Changes
  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);

    if (socket === null) return;

    const content = convertToRaw(editorState.getCurrentContent());

    socket.current.emit(SocketEvent.SEND_CHANGES, content);

    const updatedDocument = {
      ...document,
      content: JSON.stringify(content),
    } as DocumentInterface;

    setDocument(updatedDocument);

    if (document === null || JSON.stringify(content) === document.content)
      return;

    setSaving(true);

    if (saveInterval !== null) {
      clearInterval(saveInterval);
    }

    saveInterval = setInterval(async () => {
      await saveDocument(updatedDocument);
      if (saveInterval) clearInterval(saveInterval);
    }, DEFAULT_SAVE_TIME);
  };

  // FOR INLINE STYLES
  const styleMap: DraftStyleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CAPITALIZE: {
      textTransform: "capitalize",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      case "header-one":
        return "header-one";
      case "header-two":
        return "header-two";
      case "header-three":
        return "header-three";
      case "header-four":
        return "header-four";
      case "header-five":
        return "header-five";
      case "header-six":
        return "header-six";
      case "unordered-list-item":
        return "unordered-list-item";
      case "ordered-list-item":
        return "ordered-list-item";
      default:
        break;
    }
  };

  // Load Document Content
  useEffect(() => {
    if (documentRendered || document === null || document.content === null)
      return;
    try {
      const contentState = convertFromRaw(
        JSON.parse(document.content) as RawDraftContentState
      );

      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    } catch {
      error("Error when loading document.");
    } finally {
      setDocumentRendered(true);
    }
  }, [document]);

  // Connect Socket
  useEffect(() => {
    if (
      document === null ||
      accessToken === null ||
      socket === null ||
      (socket.current !== null && socket.current.connected)
    )
      return;

    socket.current = io(BASE_URL, {
      query: { documentId: document.id, accessToken },
    }).connect();
  }, [document, socket, accessToken]);

  // Disconnect Socket
  useEffect(() => {
    return () => {
      socket?.current?.disconnect();
    };
  }, []);

  // Receive Changes
  useEffect(() => {
    if (socket.current === null) return;

    const handler = (rawDraftContentState: RawDraftContentState) => {
      const contentState = convertFromRaw(rawDraftContentState);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    };
    socket.current.on(SocketEvent.RECEIVE_CHANGES, handler);

    return () => {
      socket.current.off(SocketEvent.RECEIVE_CHANGES, handler);
    };
  }, [socket.current, document]);

  // Update Current Users
  useEffect(() => {
    if (socket.current === null) return;

    const handler = (currentUsers: Array<string>) => {
      setCurrentUsers(new Set<string>(currentUsers));
    };

    socket.current.on(SocketEvent.CURRENT_USERS_UPDATE, handler);

    return () => {
      socket.current.off(SocketEvent.CURRENT_USERS_UPDATE, handler);
    };
  }, [socket.current]);

  return (
    <EditorContext.Provider
      value={{
        editorState,
        socket,
        documentRendered,
        setDocumentRendered,
        editorRef,
        currentFont,
        setEditorState,
        setCurrentFont,
        fontSize,
        setFontSize,
        focusEditor,
        handleEditorChange,
        styleMap,
        myBlockStyleFn,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
