import { useState } from 'react';

const processSteps = [
  {
    title: "Early Collecting (1903–1911)",
    description:
      "Mark Edwin Pescott-Frost began gathering artefacts and historical items related to Portsmouth Dockyard. By 1906, the collection had grown enough to secure space in the Great Ropehouse, leading to the opening of the Dockyard museum in 1911.",
    imageUrl: "/artefacts.jpg",
  },
  {
    title: "Transition & Loss",
    description:
      "When a new museum was created for HMS Victory and Lord Nelson, the original Dockyard museum lost prominence. Some artefacts were transferred to other museums, but many were lost.",
    imageUrl: "/Museum.jpg",
  },
  {
    title: "Preservation Efforts (1982)",
    description:
      "Following the 1981 Defence review, the Portsmouth Royal Dockyard Historical Society (PRDHS) was formed by former Dockyard employees to save machinery, tools, drawings, and other artefacts before they disappeared.",
    imageUrl: "/Dockyard.jpg",
  },
  {
    title: "Oral History & Documentation",
    description:
      "An oral history programme was launched, recording over 400 interviews with former Dockyard employees. Portsmouth City Museum is digitising and cataloguing these recordings.",
    imageUrl: "/employees.jpg",
  },
  {
    title: "Exhibitions & The Dockyard Apprentice (1994)",
    description:
      "PRDHS organized exhibitions and, with support, opened 'The Dockyard Apprentice' in Boathouse No. 7, displaying many artefacts and sharing Dockyard stories.",
    imageUrl: "/organization.jpg",
  },
  {
    title: "Charitable Trust & Ongoing Support",
    description:
      "In 1994, the Society became the Portsmouth Royal Dockyard Historical Trust (PRDHT), formalizing its status. The Support Group continues to care for artefacts and arrange displays for public education.",
    imageUrl: "/work.jpg",
  },
];


const ProcessSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Helper for navigation
  const goToStep = (idx: number) => {
    if (idx >= 0 && idx < processSteps.length) {
      setSelectedIndex(idx);
    }
  };

  // Animation: line grows as you progress
  const lineMaxHeight = 320; // px, adjust as needed
  const lineHeight = ((selectedIndex + 1) / processSteps.length) * lineMaxHeight;

  return (
    <section id='ProcessSection' className="py-20 bg-black min-h-screen w-full">
      <div className="container mx-auto px-0 max-w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-700 mb-4 drop-shadow-lg tracking-wide" style={{ fontFamily: 'serif', backgroundColor: 'transparent' }}>
            The Portsmouth Dockyard Story
          </h2>
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-6" viewBox="0 0 64 16" fill="none">
              <rect x="28" y="2" width="8" height="12" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
              <path d="M0 8h24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
              <path d="M40 8h24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto italic" style={{ backgroundColor: 'transparent' }}>
            Key moments in preserving the history and heritage of Portsmouth Dockyard.
          </p>
        </div>
        {/* Main content: details card + vertical line */}
        <div className="fixed inset-0 z-50 flex flex-row items-center justify-center gap-8 bg-black bg-opacity-95 w-screen h-screen">
          {/* Step summary - clean, minimal, elegant */}
          <div className="flex-1 w-full h-full max-w-none text-center rounded-none shadow-none p-0 m-0 flex flex-col items-center justify-center min-h-screen bg-transparent">
            <h3 className="text-3xl md:text-4xl font-bold text-yellow-600 mb-4" style={{ fontFamily: 'serif' }}>
              {processSteps[selectedIndex].title}
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8 w-full px-8">
              <img
          src={processSteps[selectedIndex].imageUrl}
          alt={processSteps[selectedIndex].title}
          className="rounded-lg shadow-lg max-h-80 object-cover w-full md:w-1/2"
          style={{ minWidth: 280, background: 'transparent' }}
              />
              <p className="text-gray-200 text-lg md:text-xl text-left w-full md:w-1/2 mb-4 md:mb-0 leading-relaxed">
          {processSteps[selectedIndex].description}
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
          className="px-6 py-3 border border-yellow-700 text-yellow-700 rounded hover:bg-yellow-700 hover:text-white transition text-lg font-semibold shadow-sm disabled:opacity-50"
          onClick={() => goToStep(selectedIndex - 1)}
          aria-label="Previous step"
          disabled={selectedIndex === 0}
              >
          Previous
              </button>
              <button
          className="px-6 py-3 border border-yellow-700 text-yellow-700 rounded hover:bg-yellow-700 hover:text-white transition text-lg font-semibold shadow-sm disabled:opacity-50"
          onClick={() => goToStep(selectedIndex + 1)}
          aria-label="Next step"
          disabled={selectedIndex === processSteps.length - 1}
              >
          Next
              </button>
            </div>
        </div>
          {/* Vertical line + indicator */}
          <div
            className="flex flex-col items-center"
            tabIndex={0}
            onWheel={e => {
              if (e.deltaY < 0 && selectedIndex > 0) {
                goToStep(selectedIndex - 1);
              } else if (e.deltaY > 0 && selectedIndex < processSteps.length - 1) {
                goToStep(selectedIndex + 1);
              }
            }}
            style={{ outline: 'none', minWidth: 60, height: lineMaxHeight + 40, position: 'relative' }}
          >
            {/* Animated vertical line */}
            <div
              style={{
                width: '4px',
                height: `${lineMaxHeight}px`,
                background: 'gray',
                borderRadius: '2px',
                position: 'relative',
                margin: '20px 0',
                overflow: 'hidden',
                transition: 'background 0.3s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: `${lineHeight}px`,
                  background: 'linear-gradient(to top, #FFD700, #B8860B)',
                  transition: 'height 0.5s cubic-bezier(.4,2,.6,1)',
                }}
              />
            </div>
            {/* Step indicator */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 bg-yellow-400 border-yellow-600 scale-110 z-10 shadow-lg"
              aria-label={`Current step: ${processSteps[selectedIndex].title}`}
              tabIndex={-1}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: `${20 + lineHeight - 20}px`,
                transform: 'translate(-50%, 50%)',
                transition: 'bottom 0.5s cubic-bezier(.4,2,.6,1)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24">
                <polygon
                  points="12,3 21,12 12,21 3,12"
                  fill="#FFD700"
                  stroke="#B8860B"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 6px #b8860b88)"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
