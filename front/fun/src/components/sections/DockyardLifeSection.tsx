import React, { useState, useEffect } from 'react';

// Types
interface ChapterSection {
  title?: string;
  content?: string[] | string;
}

interface ChapterData {
  _id: string;
  title: string;
  subtitle?: string;
  section?: ChapterSection[] | string;
  content?: string[] | string;
  number: number;
}

interface ApiResponse {
  success: boolean;
  data: ChapterData[];
  total: number;
}

const DockyardLifeSection = () => {
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1 = table of contents, 2+ = chapters
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

  // Fetch chapters from MongoDB service using native fetch
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/chapters`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success && data.data) {
          // Sort chapters by number to ensure correct order
          const sortedChapters = data.data.sort((a, b) => a.number - b.number);
          setChapters(sortedChapters);
        } else {
          setError('Failed to fetch chapters from server');
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError(`Failed to connect to server: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [API_BASE_URL]);

  const totalPages = chapters.length + 2; // +2 for cover and table of contents

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      if (e.key === 'ArrowRight') nextPage();
      else if (e.key === 'ArrowLeft') prevPage();
      else if (e.key === 'Home') goToPage(0);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAnimating, loading]);

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

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
    </div>
  );

  const RetryButton = ({ onRetry }: { onRetry: () => void }) => (
    <button
      onClick={onRetry}
      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      <RefreshIcon />
      Retry
    </button>
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
          Discover the evolution of Dockyard functions and support services, from early engineering innovations to comprehensive logistics for the Royal Navy. This page offers a historical overview, highlighting the Dockyard's adaptation to technological advances and its role in supplying everything from naval equipment to food and drink.
        </p>
        <p className="mb-8 text-yellow-100 text-lg leading-relaxed font-medium drop-shadow-lg max-w-2xl mx-auto">
          Explore insights from Mr. Edward Curphey's mid-20th-century articles, <strong>"Chips from a Portsmouth Basket"</strong>, which blend historical research and personal experience to provide a unique perspective on Dockyard life.
        </p>
        <p className="mb-8 text-yellow-100 text-lg leading-relaxed font-medium drop-shadow-lg max-w-2xl mx-auto">
          Digitised versions of these articles are available below. 
          {chapters.length > 0 && ` (${chapters.length} chapters available)`}
        </p>
        <button
          onClick={() => goToPage(1)}
          className="bg-yellow-500 hover:bg-yellow-400 text-amber-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Explore'}
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  const renderTableOfContents = () => (
    <div className="h-full p-8 bg-white">
      <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center font-serif">
        Table of Contents
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">Error loading chapters</p>
          <p className="text-lg mb-4">{error}</p>
          <RetryButton onRetry={() => window.location.reload()} />
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl mb-4">No chapters found</p>
          <p className="text-lg">Please check your database connection.</p>
        </div>
      ) : (
        <div className="space-y-4 h-full overflow-y-auto">
          {chapters.map((chapter, index) => (
            <button
              key={chapter._id}
              onClick={() => goToPage(index + 2)}
              className="w-full text-left p-6 rounded-lg bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 group shadow-sm"
              disabled={isAnimating}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 mb-1">
                    Chapter {chapter.number}
                  </h3>
                  <p className="text-lg text-gray-600 group-hover:text-gray-700">
                    {chapter.title}
                  </p>
                  {chapter.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {chapter.subtitle}
                    </p>
                  )}
                </div>
                <div className="text-3xl text-amber-600 group-hover:text-amber-800 transition-colors">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = (content: string[] | string | undefined): React.ReactNode[] => {
    if (!content) return [];
    
    const contentArray = Array.isArray(content) ? content : [content];
    
    return contentArray.flatMap((item, index) => {
      if (typeof item === 'string') {
        return item.split('\n\n').map((paragraph, pIdx) => (
          <p
            key={`${index}-${pIdx}`}
            className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
          >
            {paragraph.trim()}
          </p>
        ));
      }
      return [];
    });
  };

  const renderSection = (section: ChapterSection[] | string | undefined): React.ReactElement[] => {
    if (!section) return [];
    
    if (typeof section === 'string') {
      return [
        <div key="section-content" className="space-y-4">
          {section.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
            >
              {paragraph.trim()}
            </p>
          ))}
        </div>
      ];
    }
    
    if (Array.isArray(section)) {
      return section.map((sectionItem, sIdx) => (
        <section key={sIdx} className="bg-amber-50 rounded-lg p-6 shadow-sm border border-amber-100 mb-6">
          {sectionItem.title && (
            <h4 className="text-lg font-semibold text-amber-700 mb-4">{sectionItem.title}</h4>
          )}
          {sectionItem.content && (
            <div className="space-y-4">
              {renderContent(sectionItem.content)}
            </div>
          )}
        </section>
      ));
    }
    
    return [];
  };

  const renderChapter = (chapterIndex: number) => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-xl mb-4">Error loading chapter</p>
            <p className="text-lg mb-4">{error}</p>
            <RetryButton onRetry={() => window.location.reload()} />
          </div>
        </div>
      );
    }

    const chapter = chapters[chapterIndex];
    if (!chapter) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-xl text-gray-600">Chapter not found</p>
        </div>
      );
    }

    // Helper to render content that may have heading/text objects or plain strings
    const renderRichContent = (
      content: string[] | string | { heading?: string; text?: string }[] | undefined
    ) => {
      if (!content) return null;

      if (Array.isArray(content)) {
        return content.map((item, idx) => {
          if (typeof item === "string") {
            // Split by double newlines for paragraphs
            return item.split('\n\n').map((paragraph, pIdx) => (
              <p
                key={`${idx}-p-${pIdx}`}
                className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
              >
                {paragraph.trim()}
              </p>
            ));
          } else if (typeof item === "object" && (item.heading || item.text)) {
            return (
              <div key={idx} className="mb-6">
                {item.heading && (
                  <h3 className="text-2xl font-bold text-amber-700 mb-2">{item.heading}</h3>
                )}
                {item.text && (
                  <p className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 font-normal">
                    {item.text}
                  </p>
                )}
              </div>
            );
          }
          return null;
        });
      } else if (typeof content === "string") {
        return content.split('\n\n').map((paragraph, idx) => (
          <p
            key={idx}
            className="text-gray-700 text-lg leading-8 text-justify first-line:indent-8 mb-6 font-normal"
          >
            {paragraph.trim()}
          </p>
        ));
      }
      return null;
    };

    return (
      <div className="w-full h-full bg-white p-8">
        <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <span className="inline-block bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-lg font-bold shadow-md mb-4 tracking-wide uppercase">
              Chapter {chapter.number}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-800 font-serif mb-2">
              {chapter.title}
            </h1>
            {chapter.subtitle && (
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">{chapter.subtitle}</h2>
            )}
            <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full mb-6" />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-8">
            {/* Render main content (supports heading/text objects or plain strings) */}
            {chapter.content && (
              <div className="space-y-6">
                {renderRichContent(chapter.content as any)}
              </div>
            )}
            
            {/* Render sections */}
            {chapter.section && (
              <div className="space-y-8">
                {renderSection(chapter.section)}
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm italic">
              Page {chapterIndex + 3} of {totalPages}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading && currentPage === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-amber-800 text-xl mt-4">Loading Dockyard Life...</p>
          <p className="text-amber-600 text-sm mt-2">Connecting to {API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center p-4 font-serif overflow-x-auto"
      style={{
        backgroundImage: `url('/DockyardLife.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 to-orange-200/30 pointer-events-none z-0" />
      
      {/* Navigation buttons */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          disabled={isAnimating || loading}
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
          disabled={isAnimating || loading}
        >
          <div className="text-amber-800">
            <ChevronRightIcon />
          </div>
        </button>
      )}

      {/* Home button */}
      <button
        onClick={() => goToPage(0)}
        className="fixed top-4 left-4 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        disabled={loading}
      >
        <div className="text-amber-800">
          <HomeIcon />
        </div>
      </button>

      {/* Book container */}
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
          {/* Page content with sliding animation */}
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
              {/* Calculate page width so all pages (cover, toc, chapters) have equal width */}
              {Array.from({ length: totalPages }, (_, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page indicator */}
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
            disabled={isAnimating || loading}
          />
        ))}
      </div>

      {/* Page counter */}
      <div className="fixed bottom-4 right-4 z-30 bg-white/80 rounded-lg px-3 py-2 shadow-lg">
        <span className="text-amber-800 text-sm font-medium">
          {currentPage === 0 ? 'Cover' : 
           currentPage === 1 ? 'Table of Contents' : 
           `Chapter ${currentPage - 1}`}
        </span>
      </div>
    </div>
  );
};

export default DockyardLifeSection;