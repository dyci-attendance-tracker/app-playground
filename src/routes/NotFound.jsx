import error404 from '../assets/images/error-404-landing-page.png';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 py-10">
      <img 
        src={error404} 
        alt="404 Not Found" 
        className="w-full max-w-md h-auto mb-6"
      />
      <h1 className="text-color text-2xl font-bold mb-2">
        Oops! We couldn't find that page.
      </h1>
      <p className="text-color-secondary text-sm mb-6">
        The page you're looking for might have been moved or doesn't exist.
      </p>
      <a 
        href="/attendance-tracker"
        className="accent-bg text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition"
      >
        Back to Attendance Tracker
      </a>
    </div>
  );
}
