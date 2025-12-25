// Utilidades de tema usando Tailwind CSS
import { alpha, bgBlur, bgGradient, textGradient, menuItemClasses as menuItemClassesUtil } from '@/utils/theme-utils';

// ----------------------------------------------------------------------

// Nota: Las funciones paper y menuItem ahora usan Tailwind CSS
// Para aplicar estilos de paper, usa la clase paperStyles() de theme-utils
// Para menu items, usa menuItemClasses de theme-utils

// ----------------------------------------------------------------------

export { alpha, bgBlur, bgGradient, textGradient };

// ----------------------------------------------------------------------

export const hideScroll = {
  x: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  y: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
};
