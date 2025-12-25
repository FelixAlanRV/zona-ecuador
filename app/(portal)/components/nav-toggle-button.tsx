'use client';

import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/use-responsive';
import { bgBlur } from '@/theme/css';
import { useSettingsContext } from '@/utils/context/settings-context';
import { NAV } from '@/utils/constants/config-layout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NavToggleButton({ className, style, ...other }: { className?: string; style?: React.CSSProperties }) {
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });

  if (!lgUp) {
    return null;
  }

  const blurStyles = bgBlur({
    opacity: 0.48,
    color: 'hsl(var(--background))',
  });

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        (settings as any).onUpdate?.('themeLayout', settings.themeLayout === 'vertical' ? 'mini' : 'vertical');
      }}
      className={cn(
        'fixed top-8 z-50 p-1 h-8 w-8 rounded-full border border-dashed border-border bg-background hover:bg-grey-200 cursor-pointer',
        className
      )}
      style={{
        left: NAV.W_VERTICAL - 12,
        ...blurStyles,
        ...style,
      }}
      {...other}
    >
      {settings.themeLayout === 'vertical' ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
