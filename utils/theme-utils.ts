// Utilidades de tema para reemplazar funciones de MUI con Tailwind CSS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte un color hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Aplica transparencia a un color (equivalente a MUI alpha)
 * @param color - Color en formato hex (#000000) o rgb
 * @param opacity - Opacidad de 0 a 1
 * @returns Color con transparencia en formato rgba o con opacidad de Tailwind
 */
export function alpha(color: string, opacity: number): string {
  // Si es un color hex
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }
  }
  
  // Si ya es rgb o rgba
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
    }
  }
  
  // Fallback: retornar el color original
  return color;
}

/**
 * Genera estilos de blur con fondo (equivalente a MUI bgBlur)
 */
export function bgBlur(props?: {
  color?: string;
  blur?: number;
  opacity?: number;
  imgUrl?: string;
}): React.CSSProperties {
  const color = props?.color || '#000000';
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

/**
 * Genera estilos de gradiente (equivalente a MUI bgGradient)
 */
export function bgGradient(props?: {
  direction?: string;
  startColor?: string;
  endColor?: string;
  imgUrl?: string;
  color?: string;
}): React.CSSProperties {
  const direction = props?.direction || 'to bottom';
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

/**
 * Genera estilos de gradiente de texto
 */
export function textGradient(value: string): React.CSSProperties {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
}

/**
 * Clases de Tailwind para ocultar scrollbar
 */
export const hideScroll = {
  x: 'overflow-x-scroll scrollbar-none',
  y: 'overflow-y-scroll scrollbar-none',
};

/**
 * Estilos para paper con blur (equivalente a MUI paper)
 */
export function paperStyles(props?: {
  bgcolor?: string;
  dropdown?: boolean;
}): string {
  const baseClasses = 'backdrop-blur-[20px] bg-opacity-90';
  const dropdownClasses = props?.dropdown
    ? 'p-2 shadow-lg rounded-xl'
    : '';
  
  return cn(baseClasses, dropdownClasses);
}

/**
 * Estilos para menu items (equivalente a MUI menuItem)
 */
export const menuItemClasses = cn(
  'px-4 py-3 rounded-lg',
  'hover:bg-accent',
  'focus:bg-accent',
  'transition-colors',
  'cursor-pointer'
);
