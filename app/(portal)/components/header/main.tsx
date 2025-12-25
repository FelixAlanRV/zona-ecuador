import { useResponsive } from '@/hooks/use-responsive';
import { useSettingsContext } from '@/utils/context/settings-context';
import { HEADER } from '@/utils/constants/config-layout';
import { cn } from '@/lib/utils';

export default function Main({ children }: { children: React.ReactNode }) {
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';

  return (
    <main
      className={cn(
        'flex-1 flex flex-col min-h-screen overflow-x-hidden px-8',
        'transition-all duration-200'
      )}
      style={{
        paddingTop: lgUp ? HEADER.H_DESKTOP : HEADER.H_MOBILE + 24,
      }}
    >
      {children}
    </main>
  );
}
