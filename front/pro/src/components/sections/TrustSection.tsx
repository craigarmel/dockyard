import React from "react";

const TrustSection: React.FC = () => (
  <section
    className="relative h-screen flex items-center justify-center overflow-hidden"
  >
    {/* Fixed fullscreen background image overlay */}
    <div
      className="fixed inset-0 z-0 bg-black/80"
      style={{
        backgroundImage: "url('/Background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 1,
      }}
      aria-hidden="true"
    />
    <div className="relative z-10 w-full max-w-2xl md:max-w-3xl mx-auto bg-white/10 rounded-2xl shadow-2xl px-6 md:px-12 py-10 md:py-14 backdrop-blur-lg border border-white/10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-4 drop-shadow-xl tracking-tight">
      Welcome to the Portsmouth Royal Dockyard
      </h1>
      <h2 className="text-xl md:text-3xl mb-6 font-bold text-center text-blue-100">
      Portsmouth Royal Dockyard Historical Trust
      </h2>
      <p className="mb-4 text-center text-gray-200 text-base md:text-lg">
      <strong>Charity Number:</strong> 1040207 &nbsp;|&nbsp;
      <strong>Company Number:</strong> 2956399
      </p>
      <h3 className="text-base md:text-xl mt-8 mb-4 font-semibold text-blue-200 text-center">
      Our Mission and Objectives
      </h3>
      <ul className="list-disc pl-5 md:pl-10 leading-relaxed text-gray-100 space-y-2 md:space-y-3 text-sm md:text-base">
      <li>
        To promote research into the history and industrial archaeology of the Royal Dockyard at Portsmouth and to disseminate the results of such research.
      </li>
      <li>
        To promote the education of the public on matters connected with the history of the Dockyard.
      </li>
      <li>
        To advance the education of the public in the history and archaeology of the Dockyard by the maintenance of an accessible, comprehensive collection of artefacts and documents, and the promotion of associated public exhibitions.
      </li>
      </ul>
      <img
      src="/Trust.jpg"
      alt="Portsmouth Royal Dockyard Historical Trust"
      className="mt-8 w-3/4 max-w-xl mx-auto opacity-80 rounded-xl shadow-lg block"
      aria-hidden="true"
      />
    </div>
  </section>
);

export default TrustSection;
