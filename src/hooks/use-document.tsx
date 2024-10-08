import { useContext, useEffect, useState } from "react";
import useAuth from "./use-auth";
import { ToastContext } from "../contexts/toast-context";
import DocumentInterface from "../types/interfaces/document";
import DocumentService from "../services/document-service";
import axios, { AxiosError } from "axios";

const useDocument = (documentId: number, token: string) => {
  const { accessToken } = useAuth();
  const { error } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [document, setDocument] = useState<null | DocumentInterface>(null);

  const loadDocument = async (
    accessToken: string,
    documentId: number,
    token: string
  ) => {
    setLoading(true);

    try {
      const response = await DocumentService.get(
        accessToken,
        documentId,
        token
      );

      setDocument(response.data as DocumentInterface);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const { response } = error as AxiosError;

        if (response?.status === 404) {
          setErrors((prev) => [...prev, "Document does not exist"]);
        } else {
          setErrors((prev) => [
            ...prev,
            "An unknown error has occured.Please try again.",
          ]);
        }
      } else {
        setErrors((prev) => [
          ...prev,
          "An unknown error has occured. please try again.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken === null) return;

    loadDocument(accessToken, documentId, token);
  }, [accessToken, documentId, token]);

  useEffect(() => {
    if (errors.length) {
      errors.forEach((err) => {
        error(err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return {
    document,
    errors,
    loading,
  };
};

export default useDocument;
