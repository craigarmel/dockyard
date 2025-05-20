import React, { useRef, useEffect, useState } from "react";

type TimelineSection = {
    year: number;
    title: string;
    description: string[];
    imageUrl: string;
    svgFallback?: React.ReactNode;
    position: number; // 0, 50, 100 (percent)
    sectionStyle: React.CSSProperties;
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
    },
    {
        year: 1850,
        title: "1850 - The Golden Age of Naval Power",
        description: [
            "The mid-19th century marked the height of British naval power, with Portsmouth standing as its shining symbol. The city now housed modern and extensive naval facilities, testifying to the maritime supremacy of the British Empire.",
            "This was also the period when Portsmouth saw its population increase considerably, attracted by employment opportunities in the dockyards and related industries. The city expanded and modernized, with new residential areas and improved urban infrastructure.",
        ],
        imageUrl:
            "https://media.canva.com/v2/image-resize/format:PNG/height:550/quality:100/uri:ifs%3A%2F%2FM%2F5d74f09d-864f-48cc-8325-405e46ca0d01/watermark:F/width:366?csig=AAAAAAAAAAAAAAAAAAAAAFdSkWoVosx8XLdPGU9zd6g94FwcVLQgEINQnxvtbTrd&exp=1746810030&osig=AAAAAAAAAAAAAAAAAAAAAKN3rSwoCnjoMW1We1tfZY25wQq-c0pk3Vozf9xNh75N&signer=media-rpc&x-canva-quality",
        position: 50,
        sectionStyle: { top: "30%", right: "10%" },
    },
    {
        year: 1900,
        title: "1900 - Dawn of a New Century",
        description: [
            "At the turn of the 20th century, Portsmouth remained a premier naval center, but had to adapt to rapid technological changes. Steam-powered vessels gradually replaced sailing ships, and the first modern battleships appeared in the harbor.",
            "The city also underwent significant urban transformations, with improvements in living conditions and the development of public services. However, growing international tensions in Europe foreshadowed that Portsmouth would once again play a strategic role in upcoming conflicts.",
        ],
        imageUrl:
            "https://media.canva.com/v2/image-resize/format:PNG/height:550/quality:100/uri:ifs%3A%2F%2FM%2Fa58c9463-d62e-4ee6-bc98-f6afa6f238f4/watermark:F/width:366?csig=AAAAAAAAAAAAAAAAAAAAAOgutEbt8kXEwi9SBKUeVYXXJwVWw8KvqYkIIL_7Tlax&exp=1746809764&osig=AAAAAAAAAAAAAAAAAAAAAMtO6MhUlOegsW63QNJ-Dh462bwMO52TryNbV8CT8t5P&signer=media-rpc&x-canva-quality",
        position: 100,
        sectionStyle: { top: "50%", left: "15%" },
    },
];

const timelineHeight = 80; // percent

export const HistorySection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState<boolean[]>(sections.map(() => true));
    const touchStartY = useRef<number | null>(null);

    // Handle wheel and keyboard navigation
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) setActiveIndex((i) => Math.min(i + 1, sections.length - 1));
            else if (e.deltaY < 0) setActiveIndex((i) => Math.max(i - 1, 0));
            e.preventDefault();
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight")
                setActiveIndex((i) => Math.min(i + 1, sections.length - 1));
            else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
                setActiveIndex((i) => Math.max(i - 1, 0));
        };
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    // Touch navigation for mobile
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY.current === null) return;
            const delta = touchStartY.current - e.touches[0].clientY;
            if (delta > 50) {
                setActiveIndex((i) => Math.min(i + 1, sections.length - 1));
                touchStartY.current = e.touches[0].clientY;
            } else if (delta < -50) {
                setActiveIndex((i) => Math.max(i - 1, 0));
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
    }, []);

    // Parallax effect on mouse move
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const bg = document.getElementById(`parallax-bg-${sections[activeIndex].year}`);
            if (bg) {
                const x = (e.clientX / window.innerWidth - 0.5) * -10;
                const y = (e.clientY / window.innerHeight - 0.5) * -10;
                (bg as HTMLElement).style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
            }
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, [activeIndex]);

    // Handle image fallback
    const handleImageError = (idx: number) => {
        setImageLoaded((arr) => arr.map((v, i) => (i === idx ? false : v)));
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden font-montserrat text-white bg-[#0a1622]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 z-10" />
            {/* Background Images */}
            <div className="absolute inset-0 z-0">
            {sections.map((section, idx) => (
                <div
                key={section.year}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-[ease] ${activeIndex === idx ? "opacity-100" : "opacity-0"}`}
                >
                {imageLoaded[idx] ? (
                    <div
                    id={`parallax-bg-${section.year}`}
                    className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] transition-transform duration-800 ease-out"
                    style={{
                        backgroundImage: `url(${section.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "brightness(0.85) contrast(1.1) saturate(1.2)",
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
                    <div className="w-full h-full bg-[#1a3b5c] flex items-center justify-center">
                    <span className="text-[#e2b13c]">Image unavailable</span>
                    </div>
                )}
                </div>
            ))}
            </div>
            {/* Page Title */}
            <div className="fixed top-8 left-0 w-full text-center z-20 opacity-100 animate-fadeIn">
            <h1 className="font-playfair text-[3.5rem] font-bold text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] tracking-wider">
                Portsmouth History
            </h1>
            <div className="inline-block w-24 h-0.5 bg-[#e2b13c] my-4" />
            </div>
            {/* Timeline */}
            <div
            className="fixed z-10 right-[5%] top-[10%] bg-white/30"
            style={{
                height: `${timelineHeight}%`,
                width: 3,
            }}
            >
            {/* Cursor */}
            <div
                className="absolute left-1/2 -translate-x-1/2 transition-[top] duration-800 ease-[ease] z-20"
                style={{
                width: 30,
                height: 30,
                top: `${sections[activeIndex].position}%`,
                }}
            >
                <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <path
                    d="M12 4L4 12L12 20L20 12L12 4Z"
                    fill="#e2b13c"
                    stroke="white"
                    strokeWidth={1.5}
                />
                </svg>
            </div>
            {/* Dates */}
            {sections.map((section, idx) => (
                <div
                key={section.year}
                className={`absolute right-8 bg-black/70 px-3 py-1.5 rounded font-bold -translate-y-1/2 cursor-pointer transition-all duration-500 z-30 text-base ${
                    activeIndex === idx ? "opacity-100" : "opacity-50"
                }`}
                style={{
                    top: `${section.position}%`,
                }}
                onClick={() => setActiveIndex(idx)}
                >
                {section.year}
                </div>
            ))}
            </div>
            {/* Content Sections */}
            {sections.map((section, idx) => (
            <div
                key={section.year}
                className={`absolute bg-black/70 rounded-lg border-l-4 border-[#e2b13c] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[5px] z-30 px-8 py-7 transition-all duration-800 ${
                activeIndex === idx
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5 pointer-events-none"
                }`}
                style={{
                width: 450,
                ...section.sectionStyle,
                }}
            >
                <h2 className="font-playfair text-2xl font-bold mb-4">{section.title}</h2>
                {section.description.map((desc, i) => (
                <p key={i} className="text-[1.1rem] mb-4">{desc}</p>
                ))}
            </div>
            ))}
            {/* Scroll Indicator */}
            <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 text-white text-center z-[100] transition-opacity ${
                activeIndex === 0 ? "opacity-100 animate-bounce" : "opacity-0 pointer-events-none"
            }`}
            >
            <p>Scroll to travel through time</p>
            <svg
                width={24}
                height={24}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
            </svg>
            </div>
            {/* Keyframes for fadeIn and bounce */}
            <style>
            {`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @media (max-width: 768px) {
                .content-section, .absolute.bg-black\\/70.rounded-lg {
                width: 85% !important;
                left: 50% !important;
                right: auto !important;
                transform: translateX(-50%) translateY(20px);
                }
            }
            `}
            </style>
        </div>
    );
};
export default HistorySection;