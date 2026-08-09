import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-7xl tracking-wide text-cine-gold">404</p>
        <h1 className="mt-2 font-display text-2xl tracking-wide text-cine-text">
          This scene doesn't exist
        </h1>
        <p className="mt-2 text-cine-muted max-w-sm mx-auto">
          The page you're looking for was cut from the final edit. Let's get you back to the movies.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-sm font-medium bg-cine-gold hover:bg-cine-goldSoft text-cine-bg px-5 py-2.5 rounded-md transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
