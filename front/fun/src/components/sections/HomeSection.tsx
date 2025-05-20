import { useEffect, useRef } from "react";

const SHIP_BG ="/home.png"

const bubbleData = [
    { href: "#research", label: "Research", className: "left" },
    { href: "#history", label: "History", className: "center" },
    { href: "#exploration", label: "Exploration", className: "right" },
];

export default function HomeSection() {
    const particlesRef = useRef<HTMLDivElement>(null);
    const smallBubblesRef = useRef<HTMLDivElement>(null);

    // Particles and small bubbles effect
    useEffect(() => {
        // Particles
        const particlesContainer = particlesRef.current;
        if (particlesContainer) {
            particlesContainer.innerHTML = "";
            for (let i = 0; i < 50; i++) {
                const div = document.createElement("div");
                div.className = "absolute rounded-full bg-white/50 pointer-events-none";
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 3 + 1;
                div.style.left = `${x}%`;
                div.style.top = `${y}%`;
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.opacity = `${Math.random() * 0.5 + 0.2}`;
                div.style.animation = `floatParticle${i} ${Math.random() * 20 + 10}s ease-in-out infinite ${Math.random() * 5}s`;
                // Add unique keyframes for each particle
                const style = document.createElement("style");
                style.innerHTML = `
                    @keyframes floatParticle${i} {
                        0%,100% { transform: translate(0,0);}
                        25% { transform: translate(${Math.random() * 20 - 10}px,${Math.random() * 20 - 10}px);}
                        50% { transform: translate(${Math.random() * 20 - 10}px,${Math.random() * 20 - 10}px);}
                        75% { transform: translate(${Math.random() * 20 - 10}px,${Math.random() * 20 - 10}px);}
                    }
                `;
                document.head.appendChild(style);
                particlesContainer.appendChild(div);
            }
        }
        // Small bubbles
        const smallBubblesContainer = smallBubblesRef.current;
        let bubbleTimeouts: ReturnType<typeof setTimeout>[] = [];
        function createSmallBubble() {
            if (!smallBubblesContainer) return;
            const div = document.createElement("div");
            div.className =
                "absolute rounded-full pointer-events-none";
            const x = Math.random() * 100;
            const size = Math.random() * 8 + 3;
            div.style.left = `${x}%`;
            div.style.bottom = `0`;
            div.style.width = `${size}px`;
            div.style.height = `${size}px`;
            div.style.background =
                "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.5) 50%,rgba(255,255,255,0.2) 100%)";
            div.style.opacity = "0.7";
            const duration = Math.random() * 15 + 10;
            const animName = `riseBubble${Math.random()}`;
            const style = document.createElement("style");
            style.innerHTML = `
                @keyframes ${animName} {
                    0% { transform: translateY(0) translateX(0); opacity: 0.7;}
                    20% { opacity: 0.9;}
                    100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0;}
                }
            `;
            document.head.appendChild(style);
            div.style.animation = `${animName} ${duration}s linear forwards`;
            smallBubblesContainer.appendChild(div);
            const timeout = setTimeout(() => {
                div.remove();
                createSmallBubble();
            }, duration * 1000);
            bubbleTimeouts.push(timeout);
        }
        if (smallBubblesContainer) {
            smallBubblesContainer.innerHTML = "";
            for (let i = 0; i < 20; i++) createSmallBubble();
        }
        return () => {
            bubbleTimeouts.forEach(clearTimeout);
        };
    }, []);

    // Auto scroll on mount
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight * 0.875,
                behavior: "smooth",
            });
        }, 1000);
    }, []);

    return (
        <section
            className="relative h-[200vh] w-full overflow-hidden font-['Raleway'] bg-[#0a192f] text-white"
            style={{ scrollBehavior: "smooth" }}
        >
            {/* Ship background */}
            <div
                className="absolute top-0 left-0 w-full h-[200vh] bg-cover bg-top"
                style={{
                    backgroundImage: `url('${SHIP_BG}')`,
                }}
            >
                {/* fallback gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] to-[#0d2e5a] -z-10" />
            </div>
            {/* Water overlays */}
            <div className="absolute top-[75%] left-0 w-full h-[25%] bg-gradient-to-b from-[#0033664d] to-[#00143c99] z-20 pointer-events-none" />
            <div className="absolute top-[75%] left-0 w-full h-[10px] bg-gradient-to-b from-white/40 to-[#00699433] z-30 pointer-events-none" />
            <div className="absolute top-[75%] left-0 w-full h-[25%] bg-[radial-gradient(ellipse_at_center_top,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0)_70%)] z-25 pointer-events-none" />
            {/* Title */}
            <div className="absolute top-[10%] left-0 w-full text-center font-['Playfair_Display'] text-5xl md:text-7xl font-bold text-white drop-shadow-lg z-40 opacity-0 animate-fadeInTitle">
                Naval Shipyards
            </div>
            <div className="absolute top-[20%] left-0 w-full text-center font-light text-lg md:text-2xl text-white drop-shadow-lg z-40 opacity-0 animate-fadeInSubtitle">
                A dive into maritime history
            </div>
            {/* Bubbles */}
            {bubbleData.map((b) => (
                <a
                    key={b.label}
                    href={b.href}
                    className={`bubble-${b.className} absolute z-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 animate-bubbleRise${b.className.charAt(0).toUpperCase() + b.className.slice(1)} animate-floatBubble`}
                    style={{
                        width: window.innerWidth < 768 ? 102 : 153,
                        height: window.innerWidth < 768 ? 102 : 153,
                        left:
                            b.className === "left"
                                ? `calc(25% - ${(window.innerWidth < 768 ? 51 : 76.5)}px)`
                                : b.className === "center"
                                ? `calc(50% - ${(window.innerWidth < 768 ? 51 : 76.5)}px)`
                                : `calc(75% - ${(window.innerWidth < 768 ? 51 : 76.5)}px)`,
                        top: "77.5%",
                        background:
                            "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.8) 0%,rgba(255,255,255,0.4) 25%,rgba(72,154,204,0.2) 50%,rgba(24,82,177,0.3) 75%)",
                        boxShadow:
                            "0 0 20px rgba(255,255,255,0.5),inset 0 0 20px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                        transition: "transform 1s, box-shadow 1s",
                    }}
                >
                    <span
                        className="font-['Playfair_Display'] font-bold text-xl md:text-2xl text-white/90 text-center drop-shadow"
                        style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                    >
                        {b.label}
                    </span>
                </a>
            ))}
            {/* Particles */}
            <div
                ref={particlesRef}
                className="absolute top-[75%] left-0 w-full h-[25%] z-40 pointer-events-none"
            />
            {/* Small bubbles */}
            <div
                ref={smallBubblesRef}
                className="absolute top-[75%] left-0 w-full h-[25%] z-50 pointer-events-none"
            />
            {/* Animations */}
            <style>{`
                @keyframes fadeInTitle {
                    to { opacity: 1; transform: translateY(0);}
                }
                @keyframes fadeInSubtitle {
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-fadeInTitle {
                    animation: fadeInTitle 2s forwards 0.5s;
                    opacity: 0;
                    transform: translateY(-30px);
                }
                .animate-fadeInSubtitle {
                    animation: fadeInSubtitle 2s forwards 1s;
                    opacity: 0;
                    transform: translateY(-20px);
                }
                @keyframes bubbleRiseLeft {
                    0% { transform: translateY(100px); opacity: 0;}
                    100% { transform: translateY(0); opacity: 1;}
                }
                @keyframes bubbleRiseCenter {
                    0% { transform: translateY(120px); opacity: 0;}
                    100% { transform: translateY(0); opacity: 1;}
                }
                @keyframes bubbleRiseRight {
                    0% { transform: translateY(140px); opacity: 0;}
                    100% { transform: translateY(0); opacity: 1;}
                }
                @keyframes floatBubble {
                    0%,100% { transform: translateY(0);}
                    50% { transform: translateY(-15px);}
                }
                .bubble-left { animation: bubbleRiseLeft 1.5s ease-out forwards, floatBubble 6s ease-in-out infinite 1.5s;}
                .bubble-center { animation: bubbleRiseCenter 1.8s ease-out forwards, floatBubble 8s ease-in-out infinite 1.8s;}
                .bubble-right { animation: bubbleRiseRight 2.1s ease-out forwards, floatBubble 7s ease-in-out infinite 2.1s;}
                .animate-bubbleRiseLeft { }
                .animate-bubbleRiseCenter { }
                .animate-bubbleRiseRight { }
                .animate-floatBubble { }
                @media (max-width: 768px) {
                    .bubble-left { left: calc(25% - 51px) !important; width: 102px !important; height: 102px !important;}
                    .bubble-center { left: calc(50% - 51px) !important; width: 102px !important; height: 102px !important;}
                    .bubble-right { left: calc(75% - 51px) !important; width: 102px !important; height: 102px !important;}
                }
            `}</style>
        </section>
    );
}