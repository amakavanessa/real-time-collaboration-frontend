// import { useEffect } from "react";

import { useEffect, useRef } from "react";
import useAuth from "../../../hooks/use-auth";
import Spinner from "../../atoms/spinner";

interface AuthRouteProps {
  element: JSX.Element;
}

const AuthRoute = ({ element }: AuthRouteProps) => {
  const { loadingAuth, isAuthenticated, refreshAccessToken } = useAuth();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      refreshAccessToken();

      isFirstRun.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
