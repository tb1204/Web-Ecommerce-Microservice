function App() {
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-red-800 bg-blue-400">
        Hello Tailwind + TypeScript 🚀
      </h1>
      <button
        onClick={toggleDark}
        className="mb-4 px-4 py-2 bg-gray-300 dark:bg-gray-700"
      >
        Toggle Dark Mode
      </button>

      <div className="bg-white text-black dark:bg-black dark:text-white p-4">
        Hello Dark Mode
      </div>
    </>
  );
}

export default App;
