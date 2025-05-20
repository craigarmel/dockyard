import React, { useRef, useState } from "react";

const LOGO_URL ="/logo.png";
const BG_URL ="/search.png";
const menuLinks = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#" },
    { label: "History", href: "#" },
];

export default function SearchSection() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [logoError, setLogoError] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    React.useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            window.addEventListener("mousedown", handleClick);
        }
        return () => window.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

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

            {/* Header */}
            <header className="absolute top-0 left-0 w-full px-5 py-5 flex justify-between items-center z-10">
                {/* Logo */}
                <div className="h-[60px] flex items-center">
                    {!logoError ? (
                        <img
                            src={LOGO_URL}
                            alt="Logo"
                            className="h-full w-auto drop-shadow"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="h-[60px] w-[120px] bg-white/20 rounded-lg text-white flex items-center justify-center font-bold">
                            LOGO
                        </div>
                    )}
                </div>
                {/* Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        className="bg-[#1e1e1eb3] text-white p-3 w-12 h-12 rounded-full flex flex-col items-center justify-center gap-1.5 shadow transition hover:bg-[#282828cc] focus:outline-none"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Open menu"
                    >
                        <span className="block w-6 h-0.5 bg-white transition-all" />
                        <span className="block w-6 h-0.5 bg-white transition-all" />
                        <span className="block w-6 h-0.5 bg-white transition-all" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 min-w-[180px] bg-[#1e1e1ecc] backdrop-blur rounded-xl shadow-lg overflow-hidden z-20 animate-fade-in">
                            {menuLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block px-5 py-3 text-white hover:bg-white/10 transition"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </header>

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