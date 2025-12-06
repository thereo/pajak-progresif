import { useEffect, useRef } from 'react';

export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>(
  onEscape?: () => void,
  onEnter?: () => void,
  onTab?: (e: KeyboardEvent) => void,
  dependencies: unknown[] = []
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter' && onEnter) {
        // Only trigger Enter if not in a textarea or if Ctrl/Cmd is pressed
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA' || e.ctrlKey || e.metaKey) {
          onEnter();
          return;
        }
      }

      // Handle Tab key for custom tab navigation
      if (e.key === 'Tab' && onTab) {
        onTab(e);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [onEscape, onEnter, onTab, dependencies]);

  return containerRef;
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean
) {
  const containerRef = useRef<T>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0] as HTMLElement;
    lastFocusableRef.current = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Focus the first element when the trap is activated
    firstFocusableRef.current?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}
