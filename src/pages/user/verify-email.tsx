import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ToastContext } from "../../contexts/toast-context";
import AuthService from "../../services/auth-service";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const { addToast, error } = useContext(ToastContext);
  const [children, setChildren] = useState(<>Loading...</>);

  const verifyEmail = async () => {
    if (token === undefined) {
      error("This token is invalid.");
      setChildren(<Navigate to="/login" />);
      return;
    }

    try {
      await AuthService.verifyEmail(token);

      addToast({
        title: "Successfully verified your email address",
        body: "You many now login",
        color: "success",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error("An unknown error has occurred. please try again");
      } else {
        error("An unknown error has occured.Please tryy again");
      }
    } finally {
      setChildren(<Navigate to="/login" />);
      return;
    }
  };
  useEffect(() => {
    verifyEmail();
  }, []);

  return children;
};

export default VerifyEmail;
