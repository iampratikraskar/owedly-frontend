import { Link } from "react-router-dom";

function Home() {

    return (
        <div className="min-h-screen flex items-center justify-center px-6">

            <div className="text-center max-w-2xl">

                <h1 className="text-5xl font-bold text-indigo-600">
                    Owedly
                </h1>

                <p className="mt-4 text-xl text-gray-600">
                    Split expenses. Settle smarter.
                </p>

                <p className="mt-4 text-gray-500">
                    Manage group expenses, track balances,
                    and simplify who owes whom.
                </p>

                <div className="mt-8 flex justify-center gap-4">

                    <Link
                        to="/login"
                        className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Sign In
                    </Link>

                    <Link
                        to="/register"
                        className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                        Get Started
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Home;