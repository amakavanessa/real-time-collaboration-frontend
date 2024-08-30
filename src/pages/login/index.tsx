import { useContext, useState } from "react";
import TextField from "../../components/atoms/text-field";
import useWindowSize from "../../hooks/use-window-size";
import validator from "validator";
import AuthService from "../../services/auth-service";
import useAuth from "../../hooks/use-auth";
import { ToastContext } from "../../contexts/toast-context";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/atoms/logo";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/outline";

const Login = () => {
  const { widthStr, heightStr } = useWindowSize();

  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState<Array<string>>([]);
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);
  const [loading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useContext(ToastContext);
  const navigate = useNavigate();
  const validate = () => {
    setEmailErrors([]);
    setPasswordErrors([]);
    let isValid = true;

    if (!validator.isEmail(email)) {
      setEmailErrors(["Email must be a valid email!"]);
      isValid = false;
    }

    if (!password.length) {
      setPasswordErrors(["Password must not be empty"]);
      isValid = false;
    }

    return isValid;
  };

  const loginUser = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      login(newAccessToken, newRefreshToken);
      success("Successfully logged in!");
      console.log("<>Hello from login</>");
      navigate("/document/create");
    } catch (err) {
      error("Incorrect username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnkeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") loginUser();
  };

  const handleOnInputEmail = (value: string) => {
    setEmailErrors([]);
    setEmail(value);
  };

  const handleOnInputPassword = (value: string) => {
    setPasswordErrors([]);
    setPassword(value);
  };
  return (
    <div
      onKeyPress={handleOnkeyPress}
      style={{ width: widthStr, height: heightStr }}
      className="w-full flex flex-col sm:justify-center items-center p-6 bg-gray-100 dark:bg-slate-900 text-primary"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded border-primary shadow-md border dark:border-0 dark:shadow-xl p-6">
        <div className="flex flex-col space-y-4">
          <div className="w-full text-center flex flex-col justify-center items-center">
            <Logo />
            <h1 className="font-medium text-2xl">Sign In</h1>
            <p className="font-medium">to continue to Docs</p>
          </div>
          <TextField
            value={email}
            onInput={handleOnInputEmail}
            label="Email"
            color="secondary"
            errors={emailErrors}
            icon={<AtSymbolIcon className="w-5 h-5" />}
          />

          <Link
            to="/register"
            className="text-sm hover:underline font-semibold text-blue-500 text-left"
          >
            Need an account? - register
          </Link>

          <TextField
            value={password}
            onInput={handleOnInputPassword}
            label="Password"
            type="password"
            color="secondary"
            errors={passwordErrors}
            icon={<LockClosedIcon className="w-5 h-5" />}
          />

          <button
            tabIndex={-1}
            className="text-sm hover:underline font-semibold text-blue-500 text-left"
          >
            Forgot Password?
          </button>

          <button
            onClick={loginUser}
            disabled={loading}
            className={`bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded flex justify-center items-center space-x-1 
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500 active:ring-1"
              }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
      <div className="flex justify-center space-x-4 text-sm p-4">
        <button className="hover:underline font-semibold text-blue-500">
          Terms
        </button>
        <button className="hover:underline font-semibold text-blue-500">
          Privacy Policy
        </button>
      </div>
    </div>
  );
};

export default Login;
