import React, { useEffect, useRef, useState } from 'react';
import './AutoResizeWrapper.css';

const AutoResizeWrapper = ({ children, padding = 20 }) => {
  const contentRef = useRef(null);
  const [lastHeight, setLastHeight] = useState(0);
  const resizeObserverRef = useRef(null);
  const mutationObserverRef = useRef(null);
  const rafRef = useRef(null);

  // Function to calculate and send height
  const updateHeight = () => {
    if (!contentRef.current) return;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!contentRef.current) return;

      // Get the actual height of the content
      const contentHeight = contentRef.current.scrollHeight;
      const totalHeight = contentHeight + padding;

      // Only send update if height has changed
      if (totalHeight !== lastHeight) {
        setLastHeight(totalHeight);
        
        // Send height to parent frame (Wix)
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'resize-iframe',
            height: totalHeight,
            source: 'ab-civil-form'
          }, '*');
          
          console.log('Height update sent to parent:', totalHeight);
        }

        // Also try Wix-specific method if available
        if (window.Wix && window.Wix.setHeight) {
          window.Wix.setHeight(totalHeight);
        }
      }
    });
  };

  // Debounced update function
  const debouncedUpdate = (() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateHeight();
      }, 100);
    };
  })();

  useEffect(() => {
    // Initial height update
    updateHeight();

    // Set up ResizeObserver for element size changes
    if (window.ResizeObserver && contentRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          debouncedUpdate();
        }
      });
      resizeObserverRef.current.observe(contentRef.current);
    }

    // Set up MutationObserver for DOM changes
    if (window.MutationObserver && contentRef.current) {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        // Check if any mutations actually affected layout
        const hasLayoutChange = mutations.some(mutation => {
          return mutation.type === 'childList' || 
                 mutation.type === 'attributes' && 
                 (mutation.attributeName === 'style' || 
                  mutation.attributeName === 'class');
        });
        
        if (hasLayoutChange) {
          debouncedUpdate();
        }
      });

      mutationObserverRef.current.observe(contentRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Listen for window resize events
    const handleResize = () => {
      debouncedUpdate();
    };
    window.addEventListener('resize', handleResize);

    // Listen for custom events that might trigger height changes
    const handleFormChange = () => {
      debouncedUpdate();
    };
    window.addEventListener('form-content-changed', handleFormChange);

    // Listen for image loads within the content
    const images = contentRef.current?.getElementsByTagName('img') || [];
    const imageLoadHandlers = [];
    
    Array.from(images).forEach(img => {
      if (!img.complete) {
        const handler = () => debouncedUpdate();
        img.addEventListener('load', handler);
        imageLoadHandlers.push({ img, handler });
      }
    });

    // Update on any animation frames for smooth transitions
    let animationId;
    const checkHeight = () => {
      updateHeight();
      animationId = requestAnimationFrame(checkHeight);
    };
    
    // Start checking but stop after 2 seconds to save resources
    animationId = requestAnimationFrame(checkHeight);
    const stopAnimationTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
    }, 2000);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      cancelAnimationFrame(animationId);
      clearTimeout(stopAnimationTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('form-content-changed', handleFormChange);
      
      imageLoadHandlers.forEach(({ img, handler }) => {
        img.removeEventListener('load', handler);
      });
    };
  }, []); // Empty dependency array for mount-only effect

  // Trigger update when children change
  useEffect(() => {
    debouncedUpdate();
  }, [children]);

  return (
    <div ref={contentRef} className="auto-resize-wrapper">
      {children}
    </div>
  );
};

export default AutoResizeWrapper;