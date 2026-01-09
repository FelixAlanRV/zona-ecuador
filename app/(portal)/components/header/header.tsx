'use client';

import { useEffect, useState } from 'react';
import { useSettingsContext } from '@/utils/context/settings-context';
import { useResponsive } from '@/hooks/use-responsive';
import { useOffSetTop } from '@/hooks/use-off-set-top';
import { bgBlur } from '@/utils/theme-utils';
import { HEADER } from '@/utils/constants/config-layout';
import Logo from '../logo/logo';
import AccountPopover from './account-popover';
import { Button } from '@/components/ui/button';
import { Menu, Globe } from 'lucide-react'; // Añadido Globe para el estado único
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientOnly } from '@/components/client-only';

// Definimos los tipos de las props
type Props = {
  onOpenNav?: () => void;
  allowedCountries?: string[]; // Array de nombres: ["Ecuador", "Costa Rica"]
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function Header({
  onOpenNav,
  allowedCountries = [],
  user, // 👈 AQUI
}: Props) {
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });
  const offsetTop = useOffSetTop({ top: HEADER.H_DESKTOP });

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);

  // Mapeo para relacionar el valor del Select con el nombre en la DB
  const countryOptions = [
    { label: 'Ecuador', value: 'ec' },
    { label: 'Costa Rica', value: 'cr' },
  ];

  // Filtramos las opciones según lo que viene de la base de datos (allowedCountries)
  const filteredOptions = countryOptions.filter((option) =>
    allowedCountries.includes(option.label)
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname;
      if (fullPath.startsWith('/cr')) {
        setCurrentCountry('cr');
      } else {
        setCurrentCountry('ec');
      }
    }
  }, []);

  const handleCountryChange = (value: string) => {
    setCurrentCountry(value);
    window.location.href = value === 'cr' ? '/cr' : '/ec';
  };

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo className="mr-10" />}

      {!lgUp && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNav}
          className="hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="flex-1 flex items-center justify-end gap-3">
        <ClientOnly>
          {currentCountry && (
            <>
              {/* CASO A: Tiene acceso a varios países (Mostramos Select) */}
              {filteredOptions.length > 1 ? (
                <Select value={currentCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-[140px] h-9 bg-background/50 border-gray-200">
                    <SelectValue placeholder="País" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                /* CASO B: Solo tiene acceso a uno (Mostramos un Badge simple) */
                filteredOptions.length === 1 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {filteredOptions[0].label}
                    </span>
                  </div>
                )
              )}
            </>
          )}
        </ClientOnly>

        <ClientOnly>
          <AccountPopover user={user} />
        </ClientOnly>
      </div>
    </>
  );

  const blurStyles = bgBlur({
    color: 'hsl(var(--background))',
    opacity: 0.9,
    blur: 20,
  });

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-50 transition-all duration-200',
        lgUp && !isNavMini && `w-[calc(100%-260px)]`,
        lgUp && isNavMini && `w-[calc(100%-88px)]`,
        lgUp && isNavHorizontal && 'w-full',
        !lgUp && 'w-full',
      )}
      style={{
        ...blurStyles,
        height: lgUp ? HEADER.H_DESKTOP : HEADER.H_MOBILE,
      }}
    >
      <div className="h-full px-4 lg:px-10 flex items-center">
        {renderContent}
      </div>
    </header>
  );
}