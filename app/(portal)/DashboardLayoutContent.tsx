'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importante para refrescar datos del servidor
import { useResponsive } from '@/hooks/use-responsive';
import { useSettingsContext } from '@/utils/context/settings-context';
import Main from '@/app/(portal)/components/header/main';
import Header from './components/header/header';
import NavMini from './components/nav-section/mini/nav-mini';
import NavVertical from './components/nav-section/vertical/nav-vertical';

export default function DashboardLayoutContent({ 
  children, 
  navDataByCompany, 
  allowedCompanies, 
  availableCountries 
}: any) {
  const router = useRouter();
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });
  const [openNav, setOpenNav] = useState(false);
  
  // 1. ESTADO INICIAL: Intentamos leer la cookie primero
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  // 2. EFECTO DE INICIALIZACIÓN: Lee la cookie o pone la primera empresa por defecto
  useEffect(() => {
    const savedId = document.cookie
      .split('; ')
      .find(row => row.startsWith('current_company_id='))
      ?.split('=')[1];

    if (savedId) {
      setSelectedCompanyId(savedId);
    } else if (allowedCompanies.length > 0) {
      const firstId = allowedCompanies[0].id;
      setSelectedCompanyId(firstId);
      // Guardamos la cookie por primera vez
      document.cookie = `current_company_id=${firstId}; path=/; max-age=31536000`;
    }
  }, [allowedCompanies]);

  // 3. FUNCIÓN PARA CAMBIAR EMPRESA: Actualiza estado, cookie y refresca el servidor
  const handleCompanyChange = (id: string) => {
    setSelectedCompanyId(id);
    // Actualizamos la cookie
    document.cookie = `current_company_id=${id}; path=/; max-age=31536000`;
    
    // ESTO ES CLAVE: Avisa a Next.js que los datos del servidor (como la lista de usuarios) deben recargarse
    router.refresh(); 
    
    console.log(`🏢 Empresa cambiada a: ${id}`);
  };

  const currentNavData = navDataByCompany[selectedCompanyId] || [];
  const isMini = settings.themeLayout === 'mini';

  return (
    <>
      <Header 
        onOpenNav={() => setOpenNav(true)} 
        allowedCountries={availableCountries} 
      />

      <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
        {lgUp ? (
          isMini ? (
            <NavMini nav={currentNavData} />
          ) : (
            <NavVertical 
              openNav={openNav} 
              onCloseNav={() => setOpenNav(false)} 
              nav={currentNavData} 
              allowedCompanies={allowedCompanies}
              selectedCompanyId={selectedCompanyId}
              onChangeCompany={handleCompanyChange} // Usamos la nueva función
            />
          )
        ) : (
          <NavVertical 
            openNav={openNav} 
            onCloseNav={() => setOpenNav(false)} 
            nav={currentNavData} 
            allowedCompanies={allowedCompanies}
            selectedCompanyId={selectedCompanyId}
            onChangeCompany={handleCompanyChange} // Usamos la nueva función
          />
        )}

        <Main>
          <div className="w-full h-full p-4">
            {children}
          </div>
        </Main>
      </div>
    </>
  );
}