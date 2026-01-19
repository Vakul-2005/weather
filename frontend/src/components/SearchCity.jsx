import { useState } from "react";
import { MdLocationOn } from "react-icons/md";

export default function SearchCity({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 w-full max-w-xl justify-center"
    >
      {/* 🔍 INPUT WITH LOCATION ICON */}
      <div className="relative flex-1">
        <MdLocationOn
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
        />

        <input
          type="text"
          placeholder="Enter city"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🔘 SEARCH BUTTON */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
      >
        Search
      </button>
    </form>
  );
}
