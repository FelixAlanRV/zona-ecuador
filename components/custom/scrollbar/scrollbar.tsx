import React, { memo, forwardRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { cn } from '@/lib/utils';

type ScrollbarProps = {
  children?: React.ReactNode;
  className?: string;
  sx?: any; // Keeping sx for compatibility but it won't do anything
  [key: string]: any;
};

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(function Scrollbar({ children, className, sx, ...other }, ref) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return (
      <div ref={ref} className={cn("overflow-auto", className)} {...other}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex-grow h-full overflow-hidden">
      <SimpleBar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        className={cn(
          "h-full max-h-full",
          "[&_.simplebar-scrollbar:before]:bg-gray-500/50",
          "[&_.simplebar-scrollbar.simplebar-visible:before]:opacity-100",
          className
        )}
        {...other}
      >
        {children}
      </SimpleBar>
    </div>
  );
});

Scrollbar.displayName = 'Scrollbar';
export default memo(Scrollbar);
