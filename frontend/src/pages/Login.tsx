import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <input
        type="text"
        placeholder="Username"
        className="w-full px-3 py-2 border rounded bg-white text-black
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded bg-white text-black
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      <button className="w-full py-2 bg-rabbit-red text-white rounded hover:opacity-90">
        Login
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Quay về{" "}
        <Link to="/" className="text-rabbit-red hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

export default Login;
