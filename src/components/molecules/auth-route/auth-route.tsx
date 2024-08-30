// import { useEffect } from "react";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/use-auth";
import Spinner from "../../atoms/spinner";

interface AuthRouteProps {
  element: JSX.Element;
}

const AuthRoute = ({ element }: AuthRouteProps) => {
  const { loadingAuth, isAuthenticated, refreshAccessToken } = useAuth();
  const isFirstRun = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirstRun.current) {
      refreshAccessToken();
      console.log("hello from the AuthRoute Refresh");
      isFirstRun.current = false;
    }
  }, []);

  // useEffect(() => {
  //   if (loadingAuth && !isAuthenticated) {
  //     const timer = setTimeout(() => {
  //       navigate("/login");
  //     }, 60000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  if (loadingAuth) {
    return <Spinner size="lg" />;
  }

  return isAuthenticated ? element : <Spinner size="lg" />;
};

export default AuthRoute;
