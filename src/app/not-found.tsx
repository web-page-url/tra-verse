import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center font-mono">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">404</h1>
        <h2 className="text-2xl mb-8">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to planning your perfect trip.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
