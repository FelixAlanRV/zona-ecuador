import { useSettingsContext } from '@/utils/context/settings-context';
import LogoMini from '../../logo/logo-mini';
import NavSectionMini  from './NavSectionMini';
import { NAV } from '@/utils/constants/config-layout';
import NavToggleButton from '../../nav-toggle-button';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------

export default function NavMini({nav}: any) {
  const settings = useSettingsContext();
  
  const isMiniLayout = settings.themeLayout === 'mini';

  if (!isMiniLayout) {
    return null;
  }

  return (
    <nav
      className="flex-shrink-0"
      style={{
        width: NAV.W_MINI,
      }}
    >
      <NavToggleButton
        className="top-[22px]"
        style={{
          left: NAV.W_MINI - 12,
        }}
      />

      <div
        className={cn(
          "fixed pb-2 h-full border-r border-dashed border-border overflow-x-hidden",
          "scrollbar-hide" // Assuming scrollbar-hide utility exists or added
        )}
        style={{
          width: NAV.W_MINI,
        }}
      >
        <LogoMini className="mx-auto my-4" />

        <NavSectionMini
          data={nav}
        />
      </div>
    </nav>
  );
}
