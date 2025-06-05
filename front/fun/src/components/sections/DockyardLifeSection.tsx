import { useState, useEffect } from 'react';

// Remove all static chips imports and chips object

const DockyardLifeSection = () => {
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1 = table of contents, 2+ = chapters
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [chapters, setChapters] = useState<
    Array<{ title: string; content: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch chapters from dockyard service
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5003/chapters')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        // Expecting data: Array<{ title: string, content: string }>
        setChapters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setChapters([]);
        setLoading(false);
      });
  }, []);

  const totalPages = chapters.length + 2; // +2 for cover and table of contents

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      else if (e.key === 'ArrowLeft') prevPage();
      else if (e.key === 'Home') goToPage(0);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [currentPage, isAnimating, chapters.length]);

  const nextPage = () => {
    if (isAnimating || currentPage >= totalPages - 1) return;
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (isAnimating || currentPage <= 0) return;
    goToPage(currentPage - 1);
  };

  const goToPage = (pageNum: number) => {
    if (isAnimating || pageNum < 0 || pageNum >= totalPages) return;
    setIsAnimating(true);

    // Open book if going from cover
    if (currentPage === 0 && pageNum > 0) {
      setIsBookOpen(true);
    }
    // Close book if going to cover
    else if (pageNum === 0) {
      setIsBookOpen(false);
    }

    setCurrentPage(pageNum);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // SVG Icons as components
  const ChevronLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const renderCover = () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-900 text-white relative overflow-hidden">
      <div className="absolute inset-4 border-4 border-yellow-500/60 rounded-lg" />
      <div className="text-center z-10 max-w-2xl mx-auto">
        <div className="mx-auto mb-6 text-yellow-200">
          <img src="/logo.png" alt="Dockyard Life" className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg bg-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-yellow-400 font-serif">
          Dockyard Life
        </h1>
        <p className="mb-8 text-yellow-100 text-lg leading-relaxed font-medium drop-shadow-lg max-w-2xl mx-auto">
          Discover the evolution of Dockyard functions and support services, from early engineering innovations to comprehensive logistics for the Royal Navy. This page offers a historical overview, highlighting the Dockyard’s adaptation to technological advances and its role in supplying everything from naval equipment to food and drink.
        </p>
        <p className="mb-8 text-yellow-100 text-lg leading-relaxed font-medium drop-shadow-lg max-w-2xl mx-auto">
          Explore insights from Mr. Edward Curphey’s mid-20th-century articles, <strong>"Chips from a Portsmouth Basket"</strong>, which blend historical research and personal experience to provide a unique perspective on Dockyard life.
        </p>
        <p className="mb-8 text-yellow-100 text-lg leading-relaxed font-medium drop-shadow-lg max-w-2xl mx-auto">
          Digitised versions of these articles are available below.
        </p>
        <button
          onClick={() => goToPage(1)}
          className="bg-yellow-500 hover:bg-yellow-400 text-amber-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Explore
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  const renderTableOfContents = () => (
    <div className="h-full p-8 bg-white">
      <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center font-serif">
        Table des Matières
      </h1>
      <div className="space-y-4 h-full overflow-y-auto">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 2)}
            className="w-full text-left p-6 rounded-lg bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 group shadow-sm"
            disabled={isAnimating}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 mb-1">
                  Chapitre {index + 1}
                </h3>
                <p className="text-lg text-gray-600 group-hover:text-gray-700">
                  {chapter.title}
                </p>
              </div>
              <div className="text-3xl text-amber-600 group-hover:text-amber-800 transition-colors">
                →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderChapter = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    // Assume chapter.content is a JSON string with { title, subtitle, content, heading, text }
    type ChapterParsed = {
      title: string;
      subtitle: string;
      content: string | any[];
      heading: string;
      text: string;
      section?: Array<{
        title?: string;
        content?: string;
      }>;
    };
    let parsed: ChapterParsed = { title: '', subtitle: '', content: '', heading: '', text: '' };
    try {
      parsed = JSON.parse(chapter.content || '{}');
    } catch {
      parsed = { ...parsed, content: chapter.content || '' };
    }

    // Fetch extra info from API (e.g., for footnotes, references, or dynamic content)
    const [extra, setExtra] = useState<any>(null);

    useEffect(() => {
      let ignore = false;
      setExtra(null);
      fetch(`http://localhost:5002/query?chapter=${chapterIndex + 1}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (!ignore && data) setExtra(data);
        })
        .catch(() => {});
      return () => { ignore = true; };
    }, [chapterIndex]);

    return (
      <div className="w-full h-full bg-white p-8">
        <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <span className="inline-block bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-lg font-bold shadow-md mb-4 tracking-wide uppercase">
              Chapitre {chapterIndex + 1}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-800 font-serif mb-2">
              {parsed.title || chapter.title}
            </h1>
            {parsed.subtitle && (
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">{parsed.subtitle}</h2>
            )}
            <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full mb-6" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-8">
            {parsed.heading && (
              <h3 className="text-xl font-bold text-amber-800 mb-2">{parsed.heading}</h3>
            )}
            {parsed.text && (
              <p className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal">
                {parsed.text}
              </p>
            )}
            {Array.isArray(parsed.content)
              ? parsed.content.map((contentItem, idx) =>
                typeof contentItem === 'string'
                  ? contentItem.split('\n\n').map((paragraph, pIdx) => (
                    <p
                      key={`${idx}-${pIdx}`}
                      className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
                    >
                      {paragraph.trim()}
                    </p>
                  ))
                  : null
              )
              : typeof parsed.content === 'string' && parsed.content
                ? parsed.content.split('\n\n').map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
                  >
                    {paragraph.trim()}
                  </p>
                ))
                : null}
            {Array.isArray(parsed.content)
              ? parsed.content.map((contentItem, idx) => {
                if (
                  typeof contentItem === 'object' &&
                  contentItem !== null &&
                  ('heading' in contentItem || 'text' in contentItem)
                ) {
                  return (
                    <div key={idx} className="mb-6">
                      {contentItem.heading && (
                        <h3 className="text-xl font-bold text-amber-800 mb-2">{contentItem.heading}</h3>
                      )}
                      {contentItem.text && (
                        <p className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal">
                          {contentItem.text}
                        </p>
                      )}
                    </div>
                  );
                }
                if (typeof contentItem === 'string') {
                  return contentItem.split('\n\n').map((paragraph, pIdx) => (
                    <p
                      key={`${idx}-${pIdx}`}
                      className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
                    >
                      {paragraph.trim()}
                    </p>
                  ));
                }
                return null;
              })
              : typeof parsed.content === 'object' &&
                parsed.content !== null &&
                !Array.isArray(parsed.content) &&
                ('heading' in parsed.content || 'text' in parsed.content)
                ? (
                  <div>
                    {typeof parsed.content === 'object' &&
                      parsed.content !== null &&
                      'heading' in parsed.content &&
                      (parsed.content as { heading?: string }).heading && (
                        <h3 className="text-xl font-bold text-amber-800 mb-2">
                          {(parsed.content as { heading?: string }).heading}
                        </h3>
                      )}
                    {typeof parsed.content === 'object' &&
                      parsed.content !== null &&
                      'text' in parsed.content &&
                      (parsed.content as { text?: string }).text && (
                        <p className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal">
                          {(parsed.content as { text?: string }).text}
                        </p>
                      )}
                  </div>
                )
                : null}
            {Array.isArray(parsed.section) && parsed.section.length > 0 && (
              <div className="space-y-8">
                {parsed.section.map((section: any, sIdx: number) => (
                  <section key={sIdx} className="bg-amber-50 rounded-lg p-6 shadow-sm border border-amber-100">
                    {section.title && (
                      <h4 className="text-lg font-semibold text-amber-700 mb-2">{section.title}</h4>
                    )}
                    {section.content && (
                      <p className="text-gray-700 text-base leading-7 text-justify first-line:indent-6 mb-4">
                        {section.content}
                      </p>
                    )}
                    {typeof section.content === 'string' && section.content
                      ? section.content.split('\n\n').map((paragraph: string, spIdx: number) => (
                        <p
                          key={spIdx}
                          className="text-gray-700 text-base leading-7 text-justify first-line:indent-6 mb-4"
                        >
                          {paragraph.trim()}
                        </p>
                      ))
                      : null}
                  </section>
                ))}
              </div>
            )}
            {extra && (
              <div className="mt-8 p-6 bg-amber-100/60 rounded-lg border border-amber-200 shadow-inner">
                <h4 className="text-lg font-semibold text-amber-800 mb-2">Informations complémentaires</h4>
                {typeof extra === 'string' ? (
                  <p className="text-gray-700 text-base">{extra}</p>
                ) : Array.isArray(extra) ? (
                  extra.map((item, idx) => (
                    <p key={idx} className="text-gray-700 text-base mb-2">{item}</p>
                  ))
                ) : typeof extra === 'object' && extra !== null ? (
                  Object.entries(extra).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="font-semibold text-amber-700">{key}: </span>
                      <span className="text-gray-700">{String(value)}</span>
                    </div>
                  ))
                ) : null}
              </div>
            )}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm italic">
              Page {chapterIndex + 3} sur {totalPages}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4 font-serif overflow-x-auto"
      style={{
        backgroundImage: `url('/DockyardLife.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 to-orange-200/30 pointer-events-none z-0" />

      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          disabled={isAnimating}
        >
          <div className="text-amber-800">
            <ChevronLeftIcon />
          </div>
        </button>
      )}

      {currentPage < totalPages - 1 && (
        <button
          onClick={nextPage}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          disabled={isAnimating}
        >
          <div className="text-amber-800">
            <ChevronRightIcon />
          </div>
        </button>
      )}

      <button
        onClick={() => goToPage(0)}
        className="fixed top-4 left-4 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <div className="text-amber-800">
          <HomeIcon />
        </div>
      </button>

      <div className="relative z-10 flex items-center justify-center">
        <div
          className={`relative w-[min(800px,100vw-2rem)] h-[min(800px,80vh)] bg-white rounded-lg shadow-2xl transition-all duration-800 transform ${
            isBookOpen ? 'scale-100' : 'scale-95'
          } ${isAnimating ? 'transition-transform' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `${isBookOpen ? 'scale(1)' : 'scale(0.95)'} rotateY(0deg)`
          }}
        >
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              transition: isAnimating ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            <div
              className="flex h-full transition-transform duration-800 ease-in-out"
              style={{
                width: `${totalPages * 100}%`,
                transform: `translateX(-${(currentPage / totalPages) * 100}%)`
              }}
            >
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-amber-700 text-xl font-semibold">Chargement…</span>
                </div>
              ) : (
                Array.from({ length: totalPages }, (_, i) => (
                  <div
                    key={i}
                    className="h-full flex-shrink-0 rounded-lg overflow-hidden"
                    style={{ width: `${100 / totalPages}%` }}
                  >
                    {i === 0
                      ? renderCover()
                      : i === 1
                        ? renderTableOfContents()
                        : renderChapter(i - 2)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-lg">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentPage === i
                ? 'bg-amber-600 scale-125'
                : 'bg-amber-300 hover:bg-amber-400'
            }`}
            disabled={isAnimating}
          />
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-30 bg-white/80 rounded-lg px-3 py-2 shadow-lg">
        <span className="text-amber-800 text-sm font-medium">
          {currentPage === 0 ? 'Couverture' :
            currentPage === 1 ? 'Table des matières' :
              `Chapitre ${currentPage - 1}`}
        </span>
      </div>
    </div>
  );
};

export default DockyardLifeSection;
