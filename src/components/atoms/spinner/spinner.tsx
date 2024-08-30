import { useNavigate } from "react-router-dom";
import useWindowSize from "../../../hooks/use-window-size";

interface SpinnerProps {
  size: "sm" | "md" | "lg";
  className?: string;
}

// const Spinner = ({ size, className }: SpinnerProps) => {
//   const getSpinnerSize = () => {
//     switch (size) {
//       case "sm":
//         return "w-4 h-4";
//       case "md":
//         return "w-5 h-5";
//       case "lg":
//         return "w-7 h-7";
//     }
//   };

//   const getSpinnerDivSize = () => {
//     switch (size) {
//       case "sm":
//         return "w-4 h-4 border-2 margin-2 border-blue-500";
//       case "md":
//         return "w-5 h-5 border-2 margin-2 border-blue-500";

//       case "lg":
//         return "w-7 h-7 border-2 margin-2 border-blue-500";
//     }
//   };

//   return (
//     <div className={`${getSpinnerSize()} ${className} spinner`}>
//       <div className={getSpinnerDivSize()}></div>
//       <div className={getSpinnerDivSize()}></div>
//       <div className={getSpinnerDivSize()}></div>
//     </div>
//   );
// };

// export default Spinner;

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const { heightStr } = useWindowSize();
  const navigate = useNavigate();

  const getSpinnerSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-6 h-6";
      case "lg":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  return (
    <div
      className={`flex justify-center items-center flex-col ${className}`}
      style={{ height: heightStr }}
    >
      <div
        className={`${getSpinnerSize()} border-4 border-t-transparent border-blue-500 rounded-full animate-spin`}
      ></div>

      {size === "lg" && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Taking too long?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 underline"
          >
            Login
          </span>
        </div>
      )}
    </div>
  );
};

export default Spinner;
