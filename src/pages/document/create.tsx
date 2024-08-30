import { Navigate } from "react-router-dom";
import CreateDocumentButton from "../../components/atoms/create-document-button/create-document-btn";
import Spinner from "../../components/atoms/spinner";
import DocumentsList from "../../components/molecules/documents-list/documents-list";
import DocumentCreateHeader from "../../components/organisms/document-create-header/document-create-header";
import useAuth from "../../hooks/use-auth";
import useDocuments from "../../hooks/use-documents";
import useWindowSize from "../../hooks/use-window-size";

const Create = () => {
  const { heightStr } = useWindowSize();
  const { userId, isAuthenticated, loadingAuth } = useAuth();
  const { documents, loading, setDocuments } = useDocuments();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const recentDocuments =
    documents?.filter((document) => document.userId === userId) || [];
  const sharedDocuments =
    documents?.filter((document) => document.userId !== userId) || [];

  return (
    <div style={{ height: heightStr }}>
      <DocumentCreateHeader />
      <CreateDocumentButton />
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <DocumentsList
            title="Recent Documents"
            documents={recentDocuments}
            setDocuments={setDocuments}
          />
          <DocumentsList
            title="Shared Documents"
            documents={sharedDocuments}
            setDocuments={setDocuments}
          />
        </>
      )}
    </div>
  );
};

export default Create;
