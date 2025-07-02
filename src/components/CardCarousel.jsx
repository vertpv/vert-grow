import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CardCarousel = ({ 
  children, 
  itemWidth = 280, 
  gap = 16, 
  showArrows = true,
  className = '',
  style = {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [currentIndex, children]);

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < maxScroll - 1);
  };

  const scrollTo = (direction) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = itemWidth + gap;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.min(React.Children.count(children) - 1, currentIndex + 1));
    }
  };

  // Touch/Mouse drag handlers
  const handleStart = (e) => {
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const walk = (clientX - startX) * 2; // Multiply for faster scroll
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    setIsDragging(false);
    updateScrollButtons();
  };

  // Scroll event handler
  const handleScroll = () => {
    updateScrollButtons();
  };

  // Se não for mobile, renderiza grid normal
  if (!isMobile) {
    return (
      <div 
        className={`grid gap-4 ${className}`}
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          ...style
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Scroll Arrows */}
      {showArrows && (
        <>
          <button
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 btn btn-secondary p-2 rounded-full shadow-md transition-opacity ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
            onClick={() => scrollTo('left')}
            style={{ 
              width: 'var(--space-5)', 
              height: 'var(--space-5)',
              minHeight: 'var(--space-5)'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 btn btn-secondary p-2 rounded-full shadow-md transition-opacity ${
              canScrollRight ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
            onClick={() => scrollTo('right')}
            style={{ 
              width: 'var(--space-5)', 
              height: 'var(--space-5)',
              minHeight: 'var(--space-5)'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          gap: `${gap}px`,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onScroll={handleScroll}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            style={{
              minWidth: `${itemWidth}px`,
              scrollSnapAlign: 'start',
              userSelect: 'none'
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {React.Children.count(children) > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(React.Children.count(children) / 1) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-border'
              }`}
              onClick={() => {
                const container = containerRef.current;
                const scrollAmount = (itemWidth + gap) * index;
                container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardCarousel;

