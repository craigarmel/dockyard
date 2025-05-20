import { useEffect, useState } from "react";

const links = [
    {
        title: "The National Archives – Royal Navy Dockyards Staff Records",
        url: "https://www.nationalarchives.gov.uk",
        description:
            "This guide will help you find records of the staff of Royal Navy dockyards, victualling yards and other naval establishments from around the 1920s or before. The records covered are for yards in the UK and abroad.",
    },
    {
        title: "Portsmouth Historic Dockyard Information",
        url: "https://portsmouthhq.org",
        description:
            "A major web site that contains comprehensive information about the Historic Dockyard, and links to other sites maintained by the several organisations within its ambit.",
    },
    {
        title: "Portsmouth City Museum and Art Gallery",
        url: "https://portsmouthmuseum.co.uk",
        description: "Portsmouth City Museum and Art Gallery.",
    },
    {
        title: "M.E.D. Factory History",
        url: "https://medfactory.webs.com",
        description:
            "An interesting and informative site that contains a history of the M.E.D. factory, apprentice entries from 1939 -53, names of foremen, inspectors, chargemen and estimators, Hurt book details, factory sports club and photographs. Not available at present (They are undergoing some changes at VistaPrint to bring you even better services, and that means Webs.com is evolving too.).",
    },
    {
        title: "Portsmouth Dockyard History by Cranston Fine Arts",
        url: "https://www.battleships-cruisers.co.uk/portsmouth_dockyard.htm",
        description:
            "Is published by Cranston Fine Arts and has a comprehensive history of the Dockyard with photographs.",
    },
    {
        title: "National Museum of the Royal Navy",
        url: "https://www.nmrn.org.uk/",
        description:
            "Official museum of the Royal Navy based in Portsmouth and covering the whole of the UK. With six sites across the country, the National Museum of the Royal Navy is more than galleries, displays, and exhibitions. It’s real experiences!",
    },
    {
        title: "The Portsmouth Dockyard Story: From 1212 to the Present Day",
        url: "https://www.ingentaconnect.com/content/routledg/rmir20/2019/00000105/00000001/art00012",
        description: "The Portsmouth Dockyard Story: From 1212 to the present day.",
    },
    {
        title: "Chatham Dockyard Historical Society",
        url: "https://www.cdhs.org.uk/community/chatham-dockyard-historical-society",
        description: "Chatham Dockyard Historical Society.",
    },
    {
        title: "RN Museum of Radar & Communications, HMS Collingwood",
        url: "https://www.commsmuseum.co.uk",
        description: "The RN Museum of Radar & Communications, HMS Collingwood.",
    },
    {
        title: "The Naval Dockyards Society",
        url: "https://navaldockyards.org/",
        description: "The Naval Dockyards Society.",
    },
    {
        title: "Naval Historical Society of Australia",
        url: "https://www.navyhistory.org.au",
        description: "The Naval Historical Society of Australia.",
    },
    {
        title: "Local History Online",
        url: "https://www.local-history.co.uk",
        description:
            "Local History Online - for news, resources, information, courses and nearly 1,000 local history links. Also a calendar of events and local history books for sale online.",
    },
    {
        title: "Naval-History.net",
        url: "https://www.naval-history.net/index.htm",
        description:
            "NAVAL-HISTORY.NET 1998-2012 Archived by British Library, US Library of Congress, and Bavarian State Library Working with the Citizen Science Alliance Zooniverse Project/University of Oxford. A large source of information regarding naval affairs for the Great War, World War II and the Falklands War.",
    },
    {
        title: "Memorials in Portsmouth",
        url: "https://memorialsinportsmouth.co.uk",
        description:
            "The City of Portsmouth has a long and distinguished history, much of it closely associated with the Armed Forces. This is reflected in the number of memorials, both Civilian and Military within the city. These pages are dedicated to the memory of all of those men, women and children commemorated on them.",
    },
    {
        title: "Dockyard School Staff & History",
        url: "http://www.djbryant.co.uk/dockyard/sitemap.html",
        description:
            "This web site is dedicated to the Dockyard School staff, the January 1951 Entry Shipwrights and the IVth year upper-school students during their period 1954 to 1955. Although it contains content with some photographs to jog memories it goes further by giving a background to the birth and death of the dockyard schools, that became a beacon for educational excellence at home and abroad. And as added interest, there are links to the history of Portsmouth Royal Dockyard and the support given to the Royal Navy over the centuries.",
    },
    {
        title: "A Timeline of Ships, Boats and Yachts",
        url: "https://www.hmy.com/a-timeline-of-ships-boats-and-yachts",
        description:
            "This site was brought to our attention by Alexandra Fuller who wanted to let us know how much her son, Adam, enjoyed the Naval / Maritime history on our Dockyard site. He wanted to share the articles on this site regarding the history of shipbuilding. This is just the sort of interaction we are seeking to foster with the public and are delighted to add the link as requested.",
    },
    {
        title: "Trainline – Plan Rail Journeys",
        url: "https://www.thetrainline.com",
        description:
            "Trainline helps plan rail journeys and obtain live train running times, accessibility and facility information. Your destination station, to access via a short walk to Portsmouth's Royal Historic Dockyard Victory Gate is 'Portsmouth Harbour'",
    },
];
const BACKGROUND_IMAGE_URL = "/Background.jpg";

export default function LinksPage() {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12 relative overflow-hidden">
            {/* Fixed fullscreen background image */}
            <div
                className="fixed inset-0 z-1 bg-black/80"
                style={{
                    backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 1,
                }}
                aria-hidden="true"
            />
            {/* Content scrolls above background */}
            <div
                className={`relative z-10 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-3xl w-full p-8 border border-white/30 overflow-y-auto transition-opacity duration-1000 ${
                    fadeIn ? "opacity-100" : "opacity-0"
                }`}
            >
                <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-lg tracking-tight">
                    Liens utiles
                </h1>
                <p className="mb-2 text-gray-700 text-center text-lg">
                    Cette page donne accès à des informations utiles sur le Dockyard et ses environs.
                </p>
                <p className="mb-8 text-center">
                    <a
                        href="https://www.facebook.com/PRDHT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline hover:text-blue-900 font-semibold transition-colors duration-200"
                    >
                        Cliquez ici pour plus d'informations PRDHT sur Facebook
                    </a>
                </p>
                <ul className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                    {links.map((link) => (
                        <li key={link.url} className="border-b border-white/20 pb-4 last:border-b-0 transition-all duration-200 hover:bg-white/10 rounded-xl px-2">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-800 hover:text-blue-600 break-all text-lg transition-colors duration-200"
                            >
                                {link.title}
                            </a>
                            <div className="mt-1 text-sm text-blue-700 break-all">{link.url}</div>
                            <div className="mt-2 text-gray-600 text-base">{link.description}</div>
                        </li>
                    ))}
                </ul>
                <footer className="mt-12 pt-8 border-t border-white/20 text-center">
                    <a
                        href="https://www.facebook.com/PRDHT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline hover:text-blue-900 font-semibold transition-colors duration-200"
                    >
                        Like us on Facebook
                    </a>
                    <div className="mt-2 text-xs text-gray-500">
                        Copyright © 2024 PRDHT-JM
                    </div>
                </footer>
            </div>
        </main>
    );
}