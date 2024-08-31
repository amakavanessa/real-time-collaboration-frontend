import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404 - Not Found</h1>
    <p className="text-lg text-gray-700 mb-8">
      The page you're looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors duration-300"
    >
      Go to Home
    </Link>
  </div>
);

export default NotFound;
