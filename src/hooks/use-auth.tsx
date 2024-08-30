import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";
import useLocalStorage from "./use-local-storage";
import { jwtDecode as jwt_decode } from "jwt-decode";
import Token from "../types/interfaces/token";
import AuthService from "../services/auth-service";

const useAuth = () => {
  const {
    accessToken,
    setAccessToken,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setIsLoading,
    loadingAuth,
    setLoadingAuth,
    errors,
    userId,
    setUserId,
    email,
    setEmail,
  } = useContext(AuthContext);

  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
    "refreshToken",
    null
  );

  const login = (accessToken: string, refreshToken: string) => {
    const { exp, id, email } = jwt_decode<Token>(accessToken);

    setUserId(id);
    setEmail(email);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
    silentRefresh(exp);
  };
  const logout = async () => {
    if (!accessToken) return;
    try {
      await AuthService.logout(accessToken);
    } catch {
    } finally {
      destroyAuth();
    }
  };

  const silentRefresh = (exp: number) => {
    const msExpiration = Math.abs(
      new Date().getTime() - new Date(exp * 1000).getTime()
    );
    setTimeout(() => {
      refreshAccessToken();
    }, msExpiration);
  };

  const destroyAuth = () => {
    setUserId(null);
    setEmail(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    if (refreshToken === null) {
      destroyAuth();
      setLoadingAuth(false);
      return;
    }
    try {
      const response = await AuthService.refreshAccessToken({
        token: refreshToken,
      });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      login(newAccessToken, newRefreshToken);
    } catch (error) {
      destroyAuth();
    } finally {
      setLoadingAuth(false);
      console.log("hello from finally refreshAccestoken");
    }
  };

  return {
    accessToken,
    isAuthenticated,
    loading,
    loadingAuth,
    errors,
    userId,
    email,
    login,
    logout,
    refreshAccessToken,
  };
};

export default useAuth;
