'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useResponsive } from '@/hooks/use-responsive';
import { useSettingsContext } from '@/utils/context/settings-context';
import Logo from '../../logo/logo';
import Scrollbar from '@/components/custom/scrollbar/scrollbar';
import NavSectionVertical from './NavSectionVertical';
import { NAV } from '@/utils/constants/config-layout';
import NavToggleButton from '../../nav-toggle-button';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CompanySelector from './CompanySelector';

// ----------------------------------------------------------------------

interface Props {
  openNav: boolean;
  onCloseNav: () => void;
  nav: any[];
  allowedCompanies: any[];
  selectedCompanyId: string; // <-- Nueva Prop
  onChangeCompany: (id: string) => void; // <-- Nueva Prop
}

export default function NavVertical({
  openNav,
  onCloseNav,
  nav,
  allowedCompanies,
  selectedCompanyId,
  onChangeCompany
}: Props) {
  const pathname = usePathname();
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });
  const isVerticalLayout = settings.themeLayout === 'vertical';

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  // Lógica simplificada: Ya no preguntamos por países, solo cambiamos la empresa
  const handleCompanySelect = (company: any) => {
    console.log(`🏢 Cambiando a empresa: ${company.name}`);

    // Ejecutamos el cambio de ID (actualiza cookie y refresca datos)
    onChangeCompany(company.id);
  };

  const renderContent = (
    <Scrollbar
      className="h-full [&_.simplebar-content]:h-full [&_.simplebar-content]:flex [&_.simplebar-content]:flex-col"
    >
      <div className="pt-6 pb-4 flex-shrink-0">
        <Logo className="my-2 mx-auto" />
      </div>

      <div className="flex-shrink-0">
        <CompanySelector
          companies={allowedCompanies}
          selectedCompanyId={selectedCompanyId} // Para que el selector sepa cuál marcar
          onSelectCompany={handleCompanySelect}
        />
      </div>

      <div className="py-4 overflow-y-auto">
        {/* Aquí se dibujan los módulos filtrados que vienen del LayoutContent */}
        <NavSectionVertical data={nav} />
      </div>

      <div className="flex-grow" />
    </Scrollbar>
  );

  return (
    <nav
      className="flex-shrink-0"
      style={{
        width: lgUp ? NAV.W_VERTICAL : undefined,
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        isVerticalLayout && (
          <div
            className="h-full fixed border-r border-dashed border-border bg-background"
            style={{
              width: NAV.W_VERTICAL,
            }}
          >
            {renderContent}
          </div>
        )
      ) : (
        <Sheet open={openNav} onOpenChange={(open) => !open && onCloseNav()}>
          <SheetContent side="left" className="p-0 w-[280px] border-r-0">
            <VisuallyHidden>
              <SheetTitle>Navegación principal</SheetTitle>
            </VisuallyHidden>
            {renderContent}
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}