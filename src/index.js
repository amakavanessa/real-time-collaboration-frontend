import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyEmail from "../src/pages/user/verify-email";
import { ToastProvider } from "./contexts/toast-context";
import { AuthProvider } from "./contexts/auth-context";
import AuthRoute from "./components/molecules/auth-route";
import { DocumentProvider } from "./contexts/document-context";
import Document from "../src/pages/document/index";
import Create from "./pages/document/create";
import { EditorProvider } from "./contexts/editor-context";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/verify-email/:token" element={<VerifyEmail />} />
            <Route
              path="/document/create"
              element={<AuthRoute element={<Create />} />}
            />
            <Route
              path="/document/:token/:id"
              element={
                <AuthRoute
                  element={
                    <DocumentProvider>
                      <EditorProvider>
                        <Document />
                      </EditorProvider>
                    </DocumentProvider>
                  }
                />
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
