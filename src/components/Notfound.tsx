import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-extrabold text-indigo-500">404</h1>

        <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>

        <p className="text-gray-400 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist or may have been
          moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700
          text-white font-semibold px-8 py-3 rounded-lg
          transition duration-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
