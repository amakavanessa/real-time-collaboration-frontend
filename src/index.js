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
import ResetPasswoed from "../src/pages/password-reset/index";
import Create from "./pages/document/create";
import { EditorProvider } from "./contexts/editor-context";
import NotFound from "./pages/not-found/index";

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
            <Route
              path="/user/reset-password/:token"
              element={<ResetPasswoed />}
            />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
