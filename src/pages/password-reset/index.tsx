import { LockClosedIcon } from "@heroicons/react/outline";
import Logo from "../../components/atoms/logo";
import TextField from "../../components/atoms/text-field";
import useWindowSize from "../../hooks/use-window-size";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContext } from "../../contexts/toast-context";
import { useContext, useState } from "react";
import AuthService from "../../services/auth-service";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const { widthStr, heightStr } = useWindowSize();
  const { addToast, error } = useContext(ToastContext);
  const [password1, setPassword1] = useState("");
  const [password1Errors, setPassword1Errors] = useState<Array<string>>([]);
  const [password2, setPassword2] = useState("");
  const [password2Errors, setPassword2Errors] = useState<Array<string>>([]);
  const [loading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const validate = () => {
    setPassword1Errors([]);
    setPassword2Errors([]);
    let isValid = true;

    if (!(password1.length >= 8 && password1.length <= 25)) {
      setPassword1Errors((prev) => [
        ...prev,
        "Password must be between 1 and 25 characters",
      ]);
      isValid = false;
    }

    if (!/\d/.test(password1)) {
      setPassword1Errors((prev) => [
        ...prev,
        "Password must contain at least 1 number",
      ]);
      isValid = false;
    }

    if (password1 !== password2) {
      setPassword2Errors(["Passwords do not match"]);
      isValid = false;
    }

    return isValid;
  };

  const reset = async () => {
    if (token === undefined) {
      error("This token is invalid.");
      navigate("/login");
      return;
    }

    if (!validate()) return;
    setIsLoading(true);

    try {
      await AuthService.confirmResetPassword(token, { password1, password2 });

      addToast({
        title: "Password Reset Successful",
        body: "You can now log in with your new password",
        color: "success",
      });

      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error("An unknown error has occurred. Please try again");
      } else {
        error("An unknown error has occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") reset();
  };

  const handleOnInputPassword1 = (value: string) => {
    setPassword1Errors([]);
    setPassword1(value);
  };

  const handleOnInputPassword2 = (value: string) => {
    setPassword2Errors([]);
    setPassword2(value);
  };

  return (
    <div
      onKeyPress={handleOnKeyPress}
      style={{ width: widthStr, height: heightStr }}
      className="w-full flex flex-col sm:justify-center items-center p-6 bg-gray-100 dark:bg-slate-900 text-primary"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded border-primary shadow-md border dark:border-0 dark:shadow-xl p-6">
        <div className="flex flex-col space-y-4">
          <div className="w-full text-center flex flex-col justify-center items-center">
            <Logo />
            <h1 className="font-medium text-2xl">Reset your password</h1>
            <p className="font-medium">to continue to Docs</p>
          </div>
          <TextField
            value={password1}
            onInput={handleOnInputPassword1}
            label="Password"
            color="secondary"
            type="password"
            errors={password1Errors}
            icon={<LockClosedIcon className="w-5 h-5" />}
          />
          <TextField
            value={password2}
            onInput={handleOnInputPassword2}
            label="Confirm password"
            type="password"
            color="secondary"
            errors={password2Errors}
            icon={<LockClosedIcon className="w-5 h-5" />}
          />

          <Link
            to="/login"
            className="text-sm hover:underline font-semibold text-blue-500 text-left"
          >
            Remember now? sign in
          </Link>
          <button
            onClick={reset}
            disabled={loading}
            className={`bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded hover:bg-blue-500 flex justify-center items-center space-x-1 active:ring-1 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500 active:ring-1"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
