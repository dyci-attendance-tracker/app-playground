export default function GeneralError({ error }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl font-semibold text-red-600">Something went wrong</h1>
      <p className="text-gray-700 mt-2">{error?.message || 'An unexpected error occurred.'}</p>
      <a
        href="/attendance-tracker"
        className="accent-bg text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition"
      >
        Back to Attendance Tracker
      </a>
    </div>
  );
}
