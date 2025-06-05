import { useState, useEffect } from "react";

const BG_URLS = [
    "/search.png",
    "/search2.jpg",
    "/search3.jpg"
];

export default function SearchSection() {
    const [query, setQuery] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [bgIndex, setBgIndex] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<any>(null);

    // State for selected results and validation
    const [selectedResults, setSelectedResults] = useState<{ [key: string]: string[] }>({
        tridentNewspaper: [],
        dockingRegister: [],
        ratebookRecords: [],
    });
    const [isValidating, setIsValidating] = useState(false);

    // Load saved user info on component mount
    useEffect(() => {
        const savedName = localStorage.getItem("searcherName");
        const savedEmail = localStorage.getItem("searcherEmail");
        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSelectResult = (database: string, id: string) => {
        setSelectedResults((prev) => {
            const prevIds = prev[database] || [];
            if (prevIds.includes(id)) {
                return {
                    ...prev,
                    [database]: prevIds.filter((itemId) => itemId !== id),
                };
            } else {
                return {
                    ...prev,
                    [database]: [...prevIds, id],
                };
            }
        });
    };

    const databases = [
        { id: "ratebookRecords", name: "Ratebook Records", icon: "📚" },
        { id: "tridentNewspaper", name: "Trident Newspaper", icon: "📰" },
        { id: "dockingRegister", name: "Docking Register", icon: "⚓" }
    ];

    // Cycle through backgrounds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % BG_URLS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleDatabase = (dbId: string) => {
        setSelectedDatabase(prev => 
            prev.includes(dbId) 
                ? prev.filter(id => id !== dbId)
                : [...prev, dbId]
        );
    };

    const sendSelectedResults = async (database: string, selectedIds: string[]) => {
        if (!selectedIds || selectedIds.length === 0) {
            alert("No results selected!");
            return;
        }

        setIsValidating(true);
        try {
            const response = await fetch("http://localhost:5002/send-all-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    selectedRecords: searchResults.byDatabase[database].data.filter((item: any) => selectedIds.includes(item.id)),
                }),
            });
            
            // Check if response is actually JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error("Non-JSON response:", textResponse);
                throw new Error("Server returned HTML instead of JSON. Check if server is running and endpoint exists.");
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            await response.json();
            alert("Selected results will be sent to your email!");
            setSelectedResults((prev) => ({
                ...prev,
                [database]: [],
            }));
        } catch (err: any) {
            console.error("Email error:", err);
            if (err.message.includes("fetch")) {
                alert("Cannot connect to server. Please check if the server is running on http://localhost:5002");
            } else {
                alert(err?.message || "Error sending selected results. Please check server status.");
            }
        } finally {
            setIsValidating(false);
        }
    };

    const sendAllResults = async (database: string, allIds: string[]) => {
        setIsValidating(true);
        try {
            const response = await fetch("http://localhost:5002/send-all-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    selectedRecords: searchResults.byDatabase[database].data.filter((item: any) => allIds.includes(item.id)),
                }),
            });
            
            // Check if response is actually JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error("Non-JSON response:", textResponse);
                throw new Error("Server returned HTML instead of JSON. Check if server is running and endpoint exists.");
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            await response.json();
            alert(`All ${database === 'tridentNewspaper' ? 'Trident Newspaper articles' : 
                         database === 'dockingRegister' ? 'Docking Register records' : 
                         'Ratebook Records'} will be sent to your email!`);
        } catch (err: any) {
            console.error("Email error:", err);
            if (err.message.includes("fetch")) {
                alert("Cannot connect to server. Please check if the server is running on http://localhost:5002");
            } else {
                alert(err?.message || "Error sending results. Please check server status.");
            }
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-gradient" />
            
            {/* Background images with smooth transitions */}
            {BG_URLS.map((url, index) => (
                <div
                    key={url}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === bgIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${url}')`,
                            filter: "brightness(0.3) saturate(1.2)",
                        }}
                    />
                </div>
            ))}

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-3xl space-y-6 animate-fadeInUp">
                    {/* Title with gradient */}
                    <h1 className="text-5xl md:text-7xl font-bold text-center mb-2">
                        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent animate-shimmer">
                            Search Archives
                        </span>
                    </h1>
                    <p className="text-center text-white/60 text-lg mb-8">
                        Search our historical records and documents
                    </p>

                    {/* Main search container */}
                    <div className="space-y-4">
                        {/* Search box with filter button */}
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-lg group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300" />
                            
                            {/* Search input container */}
                            <div className="relative flex items-center bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What are you searching for?"
                                    className="flex-1 bg-transparent px-6 py-4 text-white placeholder-white/40 outline-none text-lg"
                                />
                                
                                {/* Filter button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-6 py-4 text-white hover:text-cyan-400 transition-all duration-200 ${
                                        showFilters ? 'text-cyan-400' : ''
                                    }`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Filters dropdown */}
                        {showFilters && (
                            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4 animate-slideDown">
                                <h3 className="text-white/80 font-medium mb-3">Select Databases:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {databases.map((db) => (
                                        <button
                                            key={db.id}
                                            onClick={() => toggleDatabase(db.id)}
                                            className={`p-4 rounded-xl border transition-all duration-200 ${
                                                selectedDatabase.includes(db.id)
                                                    ? 'bg-white/10 border-cyan-500 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="text-2xl mb-2 block">{db.icon}</span>
                                            <span className="text-sm">{db.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Name input */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-all duration-300" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="relative w-full bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 px-6 py-4 text-white placeholder-white/40 outline-none focus:border-white/20 transition-all duration-200"
                            />
                        </div>

                        {/* Email input */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-all duration-300" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="relative w-full bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 px-6 py-4 text-white placeholder-white/40 outline-none focus:border-white/20 transition-all duration-200"
                            />
                        </div>

                        {/* Additional info textarea */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-all duration-300" />
                            <textarea
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                placeholder="Further information (DOB, Craft, approximate year, etc.)"
                                rows={3}
                                className="relative w-full bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 px-6 py-4 text-white placeholder-white/40 outline-none focus:border-white/20 transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={async () => {
                                if (!query.trim() || !name.trim() || !email.trim()) {
                                    alert("Please fill in all required fields");
                                    return;
                                }
                                setIsSearching(true);
                                try {
                                    // Store name and email for future queries
                                    localStorage.setItem("searcherName", name);
                                    localStorage.setItem("searcherEmail", email);

                                    const response = await fetch("http://localhost:5002/query", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            name,
                                            query,
                                            email,
                                            databases: selectedDatabase.length ? selectedDatabase : "all",
                                            additionalInfo,
                                        }),
                                    });
                                    
                                    // Check if response is actually JSON
                                    const contentType = response.headers.get("content-type");
                                    if (!contentType || !contentType.includes("application/json")) {
                                        const textResponse = await response.text();
                                        console.error("Non-JSON response:", textResponse);
                                        throw new Error("Server returned HTML instead of JSON. Check if server is running and endpoint exists.");
                                    }
                                    
                                    if (!response.ok) {
                                        const errorData = await response.json();
                                        throw new Error(errorData.message || `Server error: ${response.status}`);
                                    }
                                    
                                    const data = await response.json();
                                    setSearchResults(data.results);
                                    
                                    // Reset selections when new search is performed
                                    setSelectedResults({
                                        tridentNewspaper: [],
                                        dockingRegister: [],
                                        ratebookRecords: [],
                                    });
                                    
                                    alert(
                                        data?.message
                                            ? data.message
                                            : "Search request submitted! We'll contact you at " + email
                                    );
                                } catch (err: any) {
                                    console.error("Search error:", err);
                                    if (err.message.includes("fetch")) {
                                        alert("Cannot connect to server. Please check if the server is running on http://localhost:5002");
                                    } else {
                                        alert(err?.message || "There was an error submitting your search request.");
                                    }
                                } finally {
                                    setIsSearching(false);
                                    setQuery("");
                                    setAdditionalInfo("");
                                    setSelectedDatabase([]);
                                    setShowFilters(false);
                                }
                            }}
                            disabled={isSearching}
                            className="w-full relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300" />
                            <div className="relative bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 px-8 py-4 text-white font-medium hover:bg-white/5 transition-all duration-200 disabled:opacity-50">
                                {isSearching ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Submit Search Request"
                                )}
                            </div>
                        </button>

                        {/* Results display */}
                        {searchResults && (
                            <div className="mt-8 space-y-6">
                                <h2 className="text-2xl font-bold text-white/90">Results ({searchResults.totalFound})</h2>
                                
                                {/* Trident Newspaper Results */}
                                {searchResults.byDatabase?.tridentNewspaper && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                                            Trident Newspaper ({searchResults.byDatabase.tridentNewspaper.count})
                                        </h3>
                                        <div className="space-y-4">
                                            {searchResults.byDatabase.tridentNewspaper.data.map((article: any) => (
                                                <div
                                                    key={article.id}
                                                    className={`bg-black/60 border border-cyan-900 rounded-xl p-5 text-white/90 shadow-lg flex items-start gap-4 ${
                                                        selectedResults.tridentNewspaper?.includes(article.id)
                                                            ? "ring-2 ring-cyan-400"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedResults.tridentNewspaper?.includes(article.id) || false}
                                                        onChange={() => handleSelectResult("tridentNewspaper", article.id)}
                                                        className="mt-1 accent-cyan-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                            <div>
                                                                <div className="text-lg font-bold">{article.headline}</div>
                                                                <div className="text-white/60 text-sm">
                                                                    {article.date} &mdash; Issue: {article.issueNumber}, Page: {article.page}
                                                                </div>
                                                                <div className="text-white/40 text-xs capitalize">
                                                                    Category: {article.category}
                                                                </div>
                                                            </div>
                                                            <div className="text-right text-white/60 text-sm">
                                                                {article.photographer && (
                                                                    <span>Photo: {article.photographer}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-white/80 text-sm">
                                                            {article.content}
                                                        </div>
                                                        {article.mentions && article.mentions.length > 0 && (
                                                            <div className="mt-1 text-white/60 text-xs">
                                                                <strong>Mentions:</strong> {article.mentions.join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="mt-6 space-y-3">
                                            {/* Send selected button */}
                                            {selectedResults.tridentNewspaper && selectedResults.tridentNewspaper.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendSelectedResults("tridentNewspaper", selectedResults.tridentNewspaper)}
                                                >
                                                    {isValidating ? "Sending..." : `Send Selected Articles (${selectedResults.tridentNewspaper.length}) by Email`}
                                                </button>
                                            )}
                                            
                                            {/* Send all button */}
                                            {searchResults.byDatabase.tridentNewspaper.data.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600/80 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendAllResults("tridentNewspaper", searchResults.byDatabase.tridentNewspaper.data.map((article: any) => article.id))}
                                                >
                                                    {isValidating ? "Sending..." : "Send All Trident Newspaper Articles by Email"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Docking Register Results */}
                                {searchResults.byDatabase?.dockingRegister && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                                            Docking Register ({searchResults.byDatabase.dockingRegister.count})
                                        </h3>
                                        <div className="space-y-4">
                                            {searchResults.byDatabase.dockingRegister.data.map((entry: any) => (
                                                <div
                                                    key={entry.id}
                                                    className={`bg-black/60 border border-cyan-900 rounded-xl p-5 text-white/90 shadow-lg flex items-start gap-4 ${
                                                        selectedResults.dockingRegister?.includes(entry.id)
                                                            ? "ring-2 ring-cyan-400"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedResults.dockingRegister?.includes(entry.id) || false}
                                                        onChange={() => handleSelectResult("dockingRegister", entry.id)}
                                                        className="mt-1 accent-cyan-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                            <div>
                                                                <div className="text-lg font-bold">{entry.name}</div>
                                                                <div className="text-white/60 text-sm">{entry.craft} &mdash; {entry.department}</div>
                                                                <div className="text-white/40 text-xs">
                                                                    DOB: {entry.dateOfBirth} | Entry: {entry.entryNumber}
                                                                </div>
                                                            </div>
                                                            <div className="text-right text-white/60 text-sm">
                                                                {entry.startDate} - {entry.endDate}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-white/80 text-sm space-y-1">
                                                            <div><strong>Supervisors:</strong> {entry.supervisors?.join(", ") || "N/A"}</div>
                                                            <div><strong>Skills:</strong> {entry.skills?.join(", ") || "N/A"}</div>
                                                            <div><strong>Awards:</strong> {entry.awards?.join(", ") || "None"}</div>
                                                            {entry.notes && <div><strong>Notes:</strong> {entry.notes}</div>}
                                                            {entry.address && <div className="text-white/60 text-xs"><strong>Address:</strong> {entry.address}</div>}
                                                            {entry.nextOfKin && <div className="text-white/60 text-xs"><strong>Next of Kin:</strong> {entry.nextOfKin}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="mt-6 space-y-3">
                                            {selectedResults.dockingRegister && selectedResults.dockingRegister.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendSelectedResults("dockingRegister", selectedResults.dockingRegister)}
                                                >
                                                    {isValidating ? "Sending..." : `Send Selected Records (${selectedResults.dockingRegister.length}) by Email`}
                                                </button>
                                            )}
                                            
                                            {searchResults.byDatabase.dockingRegister.data.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600/80 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendAllResults("dockingRegister", searchResults.byDatabase.dockingRegister.data.map((entry: any) => entry.id))}
                                                >
                                                    {isValidating ? "Sending..." : "Send All Docking Register Records by Email"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Ratebook Records Results */}
                                {searchResults.byDatabase?.ratebookRecords && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                                            Ratebook Records ({searchResults.byDatabase.ratebookRecords.count})
                                        </h3>
                                        <div className="space-y-4">
                                            {searchResults.byDatabase.ratebookRecords.data.map((record: any) => (
                                                <div
                                                    key={record.id}
                                                    className={`bg-black/60 border border-cyan-900 rounded-xl p-5 text-white/90 shadow-lg flex items-start gap-4 ${
                                                        selectedResults.ratebookRecords?.includes(record.id)
                                                            ? "ring-2 ring-cyan-400"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedResults.ratebookRecords?.includes(record.id) || false}
                                                        onChange={() => handleSelectResult("ratebookRecords", record.id)}
                                                        className="mt-1 accent-cyan-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                            <div>
                                                                <div className="text-lg font-bold">{record.name}</div>
                                                                <div className="text-white/60 text-sm">
                                                                    Employee #: {record.employeeNumber} &mdash; {record.craft}
                                                                </div>
                                                                <div className="text-white/40 text-xs">
                                                                    Department: {record.department} | Foreman: {record.foreman}
                                                                </div>
                                                            </div>
                                                            <div className="text-right text-white/60 text-sm">
                                                                Week Ending: {record.weekEnding}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-white/80 text-sm space-y-1">
                                                            <div><strong>Standard Rate:</strong> {record.standardRate}</div>
                                                            <div><strong>Hours Worked:</strong> {record.hoursWorked}</div>
                                                            <div><strong>Overtime:</strong> {record.overtimeHours} hrs @ {record.overtimeRate}</div>
                                                            <div><strong>Total Wages:</strong> {record.totalWages}</div>
                                                            <div><strong>Deductions:</strong> {record.deductions}</div>
                                                            <div><strong>Net Pay:</strong> {record.netPay}</div>
                                                            <div className="text-white/60 text-xs">
                                                                <strong>Book:</strong> {record.bookNumber}, Page: {record.pageNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="mt-6 space-y-3">
                                            {selectedResults.ratebookRecords && selectedResults.ratebookRecords.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendSelectedResults("ratebookRecords", selectedResults.ratebookRecords)}
                                                >
                                                    {isValidating ? "Sending..." : `Send Selected Records (${selectedResults.ratebookRecords.length}) by Email`}
                                                </button>
                                            )}
                                            
                                            {searchResults.byDatabase.ratebookRecords.data.length > 0 && (
                                                <button
                                                    className="w-full bg-cyan-600/80 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-all"
                                                    disabled={isValidating}
                                                    onClick={() => sendAllResults("ratebookRecords", searchResults.byDatabase.ratebookRecords.data.map((record: any) => record.id))}
                                                >
                                                    {isValidating ? "Sending..." : "Send All Ratebook Records by Email"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Info text */}
                        <p className="text-center text-white/40 text-sm mt-6">
                            We'll review your search request and contact you via email with the results
                        </p>
                    </div>
                </div>
            </div>

            {/* Animated CSS */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shimmer {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes gradient {
                    0% {
                        transform: rotate(0deg) scale(1.5);
                    }
                    100% {
                        transform: rotate(360deg) scale(1.5);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }

                .animate-shimmer {
                    background-size: 200% 200%;
                    animation: shimmer 3s ease-in-out infinite;
                }

                .animate-gradient {
                    animation: gradient 20s linear infinite;
                }
            `}</style>
        </div>
    );
}