'use client';

import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Query = 'up' | 'down' | 'between' | 'only';

interface UseResponsiveOptions {
  query: Query;
  start?: Breakpoint;
  end?: Breakpoint;
}

// Tailwind CSS breakpoints (en píxeles)
const breakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Hook personalizado para responsive design usando Tailwind breakpoints
 * Reemplaza useMediaQuery y useTheme de MUI
 * 
 * @example
 * const isMobile = useResponsive({ query: 'down', start: 'sm' });
 * const isDesktop = useResponsive({ query: 'up', start: 'lg' });
 */
export function useResponsive({ query, start, end }: UseResponsiveOptions): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let mediaQuery: string;

    switch (query) {
      case 'up':
        if (!start) return;
        mediaQuery = `(min-width: ${breakpoints[start]}px)`;
        break;
      case 'down':
        if (!start) return;
        mediaQuery = `(max-width: ${breakpoints[start] - 1}px)`;
        break;
      case 'between':
        if (!start || !end) return;
        mediaQuery = `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end] - 1}px)`;
        break;
      case 'only':
        if (!start) return;
        const breakpointKeys = Object.keys(breakpoints) as Breakpoint[];
        const currentIndex = breakpointKeys.indexOf(start);
        const nextBreakpoint = breakpointKeys[currentIndex + 1];
        
        if (nextBreakpoint) {
          mediaQuery = `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[nextBreakpoint] - 1}px)`;
        } else {
          mediaQuery = `(min-width: ${breakpoints[start]}px)`;
        }
        break;
      default:
        return;
    }

    const mediaQueryList = window.matchMedia(mediaQuery);
    
    // Set initial value
    setMatches(mediaQueryList.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query, start, end]);

  return matches;
}

/**
 * Hook simplificado para verificar si estamos en mobile
 */
export function useIsMobile(): boolean {
  return useResponsive({ query: 'down', start: 'md' });
}

/**
 * Hook simplificado para verificar si estamos en desktop
 */
export function useIsDesktop(): boolean {
  return useResponsive({ query: 'up', start: 'lg' });
}

/**
 * Hook para obtener el breakpoint actual
 */
export function useCurrentBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}
