import React, { useRef, useEffect, useState, useCallback } from "react";

type TimelineSection = {
    year: number;
    title: string;
    description: string[];
    imageUrl: string;
    position: number; // 0, 50, 100 (percent)
    sectionStyle: React.CSSProperties;
    color?: string;
    highlights?: string[];
};

const sections: TimelineSection[] = [
    {
        year: 1802,
        title: "1802 - Maritime Beginnings",
        description: [
            "In the early 19th century, Portsmouth established itself as one of Britain's most important naval ports. The city played a crucial role during the Napoleonic Wars, serving as the main base for the Royal Navy.",
            "Portsmouth's dockyards experienced intense activity, building and repairing ships that would form the British fleet. The city became a strategic center for control of the seas and protection of British interests throughout the world.",
        ],
        imageUrl: "history1.png",
        position: 0,
        sectionStyle: { top: "40%", left: "10%" },
        color: "#e2b13c",
        highlights: ["Napoleonic Wars", "Royal Navy Base", "Strategic Center"]
    },
    {
        year: 1850,
        title: "1850 - The Golden Age of Naval Power",
        description: [
            "The mid-19th century marked the height of British naval power, with Portsmouth standing as its shining symbol. The city now housed modern and extensive naval facilities, testifying to the maritime supremacy of the British Empire.",
            "This was also the period when Portsmouth saw its population increase considerably, attracted by employment opportunities in the dockyards and related industries. The city expanded and modernized, with new residential areas and improved urban infrastructure.",
        ],
        imageUrl: "history2.png",
        position: 50,
        sectionStyle: { top: "30%", right: "10%" },
        color: "#60a5fa",
        highlights: ["British Empire", "Naval Supremacy", "Industrial Growth"]
    },
    {
        year: 1900,
        title: "1900 - Dawn of a New Century",
        description: [
            "At the turn of the 20th century, Portsmouth remained a premier naval center, but had to adapt to rapid technological changes. Steam-powered vessels gradually replaced sailing ships, and the first modern battleships appeared in the harbor.",
            "The city also underwent significant urban transformations, with improvements in living conditions and the development of public services. However, growing international tensions in Europe foreshadowed that Portsmouth would once again play a strategic role in upcoming conflicts.",
        ],
        imageUrl: "history3.png",
        position: 100,
        sectionStyle: { top: "50%", left: "15%" },
        color: "#f59e0b",
        highlights: ["Steam Power", "Modern Battleships", "Urban Development"]
    },
];

const timelineHeight = 80; // percent

export const HistorySection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState<boolean[]>(sections.map(() => true));
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const touchStartY = useRef<number | null>(null);
    const lastWheelTime = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    // Throttled navigation to prevent rapid switching
    const navigateToSection = useCallback((newIndex: number) => {
        if (isTransitioning || newIndex === activeIndex) return;
        
        const clampedIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
        if (clampedIndex !== activeIndex) {
            setIsTransitioning(true);
            setActiveIndex(clampedIndex);
            setTimeout(() => setIsTransitioning(false), 800);
        }
    }, [activeIndex, isTransitioning]);

    // Enhanced wheel navigation with throttling
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            const now = Date.now();
            if (now - lastWheelTime.current < 300) return; // Throttle to 300ms
            
            lastWheelTime.current = now;
            
            if (e.deltaY > 0) {
                navigateToSection(activeIndex + 1);
            } else if (e.deltaY < 0) {
                navigateToSection(activeIndex - 1);
            }
            e.preventDefault();
        };

        const onKeyDown = (e: KeyboardEvent) => {
            switch(e.key) {
                case "ArrowDown":
                case "ArrowRight":
                case " ":
                    e.preventDefault();
                    navigateToSection(activeIndex + 1);
                    break;
                case "ArrowUp":
                case "ArrowLeft":
                    e.preventDefault();
                    navigateToSection(activeIndex - 1);
                    break;
                case "Home":
                    e.preventDefault();
                    navigateToSection(0);
                    break;
                case "End":
                    e.preventDefault();
                    navigateToSection(sections.length - 1);
                    break;
                case "1":
                case "2":
                case "3":
                    e.preventDefault();
                    navigateToSection(parseInt(e.key) - 1);
                    break;
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [activeIndex, navigateToSection]);

    // Enhanced touch navigation
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };
        
        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY.current === null || isTransitioning) return;
            
            const delta = touchStartY.current - e.touches[0].clientY;
            const threshold = 80; // Increased threshold for better touch experience
            
            if (Math.abs(delta) > threshold) {
                if (delta > 0) {
                    navigateToSection(activeIndex + 1);
                } else {
                    navigateToSection(activeIndex - 1);
                }
                touchStartY.current = e.touches[0].clientY;
            }
            e.preventDefault();
        };

        window.addEventListener("touchstart", onTouchStart, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [activeIndex, navigateToSection, isTransitioning]);

    // Optimized parallax effect with requestAnimationFrame
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    useEffect(() => {
        const updateParallax = () => {
            const bg = document.getElementById(`parallax-bg-${sections[activeIndex].year}`);
            if (bg) {
                const x = (mousePosition.x / window.innerWidth - 0.5) * -8;
                const y = (mousePosition.y / window.innerHeight - 0.5) * -8;
                bg.style.transform = `scale(1.03) translate(${x}px, ${y}px)`;
            }
        };

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(updateParallax);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [mousePosition, activeIndex]);

    // Image loading with retry logic
    const handleImageError = useCallback((idx: number) => {
        setImageLoaded((arr) => arr.map((v, i) => (i === idx ? false : v)));
    }, []);

    // Progress calculation
    const progress = ((activeIndex + 1) / sections.length) * 100;

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden font-sans text-white bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Enhanced overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30 z-10" />
            
            {/* Progress indicator */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/20 z-50">
                <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-800 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* Background Images with improved transitions */}
            <div className="absolute inset-0 z-0">
                {sections.map((section, idx) => (
                    <div
                        key={section.year}
                        className={`absolute inset-0 transition-all duration-1000 ease-out ${
                            activeIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    >
                        {imageLoaded[idx] ? (
                            <div
                                id={`parallax-bg-${section.year}`}
                                className="absolute -inset-4 transition-transform duration-700 ease-out"
                                style={{
                                    backgroundImage: `url(${section.imageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    filter: "brightness(0.7) contrast(1.2) saturate(1.1)",
                                }}
                            >
                                <img
                                    src={section.imageUrl}
                                    alt={section.title}
                                    className="hidden"
                                    onError={() => handleImageError(idx)}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white/80">Loading historical image...</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Enhanced page title with animation */}
            <div className="fixed top-8 left-0 w-full text-center z-20">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wide">
                    <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                        Portsmouth History
                    </span>
                </h1>
                <div className="flex justify-center items-center space-x-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-20"></div>
                </div>
            </div>

            {/* Enhanced timeline with interactive elements */}
            <div
                className="fixed z-20 right-8 top-1/2 transform -translate-y-1/2"
                style={{ height: `${timelineHeight}%` }}
            >
                {/* Timeline line */}
                <div className="relative w-1 h-full bg-white/20 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-purple-500 transition-all duration-800 ease-out rounded-full"
                        style={{ height: `${((activeIndex + 1) / sections.length) * 100}%` }}
                    />
                </div>

                {/* Timeline points */}
                {sections.map((section, idx) => (
                    <div
                        key={section.year}
                        className="absolute -left-3 transform -translate-y-1/2 cursor-pointer group"
                        style={{ top: `${section.position}%` }}
                        onClick={() => navigateToSection(idx)}
                    >
                        <div className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${
                            activeIndex === idx 
                                ? `bg-gradient-to-r from-blue-400 to-purple-500 border-white scale-125 shadow-lg` 
                                : `bg-white/20 border-white/40 hover:bg-white/30 hover:scale-110`
                        }`}>
                            <div className="w-full h-full rounded-full flex items-center justify-center">
                                {activeIndex === idx && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                        </div>
                        
                        {/* Year label */}
                        <div className={`absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                            activeIndex === idx 
                                ? 'bg-white/90 text-gray-900 shadow-lg' 
                                : 'bg-black/60 text-white/80 group-hover:bg-black/80'
                        }`}>
                            {section.year}
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced content sections */}
            {sections.map((section, idx) => (
                <div
                    key={section.year}
                    className={`absolute z-30 transition-all duration-800 ease-out ${
                        activeIndex === idx
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                    }`}
                    style={{
                        width: 'min(500px, 90vw)',
                        ...section.sectionStyle,
                    }}
                >
                    <div className="bg-black/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                        {/* Header with accent color */}
                        <div 
                            className="h-1 w-full"
                            style={{ backgroundColor: section.color }}
                        />
                        
                        <div className="p-8">
                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                                <span 
                                    className="bg-gradient-to-r bg-clip-text text-transparent"
                                    style={{ 
                                        backgroundImage: `linear-gradient(135deg, ${section.color}, white)` 
                                    }}
                                >
                                    {section.title}
                                </span>
                            </h2>

                            {/* Highlights */}
                            {section.highlights && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {section.highlights.map((highlight, i) => (
                                        <span 
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 border border-white/20"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            {section.description.map((desc, i) => (
                                <p key={i} className="text-lg leading-relaxed mb-4 text-white/90 last:mb-0">
                                    {desc}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation controls */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                    <button
                        onClick={() => navigateToSection(activeIndex - 1)}
                        disabled={activeIndex === 0 || isTransitioning}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Previous period"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex space-x-1">
                        {sections.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigateToSection(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    idx === activeIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                                }`}
                                aria-label={`Go to period ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => navigateToSection(activeIndex + 1)}
                        disabled={activeIndex === sections.length - 1 || isTransitioning}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Next period"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={`fixed bottom-8 right-8 text-white text-center z-40 transition-opacity duration-500 ${
                activeIndex === 0 && !isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
                <div className="bg-black/60 backdrop-blur-lg rounded-lg px-4 py-3 border border-white/20">
                    <p className="text-sm mb-2">Navigate through time</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-white/70">
                        <span>Scroll</span>
                        <span>•</span>
                        <span>Arrow keys</span>
                        <span>•</span>
                        <span>Click timeline</span>
                    </div>
                </div>
            </div>

            {/* Accessibility improvements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                Currently viewing: {sections[activeIndex].title}
            </div>

            {/* Enhanced animations and responsive design */}
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

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                @media (max-width: 768px) {
                    .absolute[style*="left: 10%"] {
                        left: 5% !important;
                        width: 90% !important;
                    }
                    .absolute[style*="right: 10%"] {
                        right: 5% !important;
                        left: 5% !important;
                        width: 90% !important;
                    }
                    .absolute[style*="left: 15%"] {
                        left: 5% !important;
                        width: 90% !important;
                    }
                }

                @media (max-width: 640px) {
                    .fixed.right-8 {
                        right: 1rem !important;
                    }
                    .absolute.-left-3 .absolute.right-10 {
                        right: 2.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default HistorySection;