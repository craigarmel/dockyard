import { useState } from "react";

const BG_URL = "/search.png";

export default function SearchSection() {
    const [query, setQuery] = useState("");

    function handleSearch() {
        if (query.trim() === "") {
            alert("Please enter a search term");
        } else {
            alert("Searching for: " + query);
        }
    }

    return (
        <div className="relative min-h-screen font-['Poppins'] overflow-hidden bg-[#1a1a1a]">
            {/* Background image and overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url('${BG_URL}')`,
                    filter: "blur(5px)",
                }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Centered content */}
            <main className="absolute top-1/2 left-1/2 w-full max-w-xl px-5 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-2 drop-shadow">
                    Search
                </h1>
                <p className="text-white/90 text-center mb-8 drop-shadow">
                    Find what you're looking for
                </p>
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full py-4 px-6 pr-14 text-lg rounded-full border-none bg-white/90 shadow focus:outline-none focus:bg-white focus:shadow-lg transition"
                        placeholder="What are you searching for?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <button
                        className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={22}
                            height={22}
                            fill="#555"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </div>
            </main>
        </div>
    );
}
