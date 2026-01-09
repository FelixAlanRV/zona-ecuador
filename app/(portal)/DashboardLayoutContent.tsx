'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/use-responsive';
import { useSettingsContext } from '@/utils/context/settings-context';
import Main from '@/app/(portal)/components/header/main';
import Header from './components/header/header';
import NavMini from './components/nav-section/mini/nav-mini';
import NavVertical from './components/nav-section/vertical/nav-vertical';

interface ModuleItem {
  nombre: string;
  url: string;
  icono: string;
  position: number;
  acciones: {
    visualizar: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
}

interface Props {
  children: React.ReactNode;
  navDataByCompany: Record<string, ModuleItem[]>;
  allowedCompanies: { id: string; name: string; zona: string; logo: string }[];
  availableCountries: string[];
  user: { id: string; name: string; email: string };
}

export default function DashboardLayoutContent({
  children,
  navDataByCompany,
  allowedCompanies,
  availableCountries,
  user
}: Props) {
  const router = useRouter();
  const settings = useSettingsContext();
  const lgUp = useResponsive({ query: 'up', start: 'lg' });
  const [openNav, setOpenNav] = useState(false);

  // 🏢 Empresa seleccionada
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  // 📂 Módulos visibles para la empresa seleccionada
  const [currentNavData, setCurrentNavData] = useState<ModuleItem[]>([]);

  // 1️⃣ Inicialización: leer cookie o tomar la primera empresa válida
  useEffect(() => {
    const savedId = document.cookie
      .split('; ')
      .find(row => row.startsWith('current_company_id='))
      ?.split('=')[1];

    let initialId = '';
    if (savedId && navDataByCompany[savedId]) {
      initialId = savedId;
    } else if (allowedCompanies.length > 0) {
      initialId = allowedCompanies[0].id;
      document.cookie = `current_company_id=${initialId}; path=/; max-age=31536000`;
    }

    setSelectedCompanyId(initialId);
    console.log('📌 Empresa inicial:', initialId);
  }, [allowedCompanies, navDataByCompany]);

  // 2️⃣ Recalcular módulos cada vez que cambia la empresa o navData
  useEffect(() => {
    if (selectedCompanyId) {
      const modules = (navDataByCompany[selectedCompanyId] || []).filter(
        m => m.acciones.visualizar
      );
      setCurrentNavData(modules);
      console.log('📌 Módulos actualizados para empresa', selectedCompanyId, modules);
    }
  }, [selectedCompanyId, navDataByCompany]);

  // 3️⃣ Función para cambiar empresa: actualiza estado, cookie y refresca
  const handleCompanyChange = (id: string) => {
    setSelectedCompanyId(id);
    document.cookie = `current_company_id=${id}; path=/; max-age=31536000`;
    router.refresh();
    console.log('🏢 Empresa cambiada a:', id);
  };

  const isMini = settings.themeLayout === 'mini';

  return (
    <>
      <Header
        onOpenNav={() => setOpenNav(true)}
        allowedCountries={availableCountries}
        user={user}
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
              onChangeCompany={handleCompanyChange}
            />
          )
        ) : (
          <NavVertical
            openNav={openNav}
            onCloseNav={() => setOpenNav(false)}
            nav={currentNavData}
            allowedCompanies={allowedCompanies}
            selectedCompanyId={selectedCompanyId}
            onChangeCompany={handleCompanyChange}
          />
        )}

        <Main>
          <div className="w-full h-full p-4">{children}</div>
        </Main>
      </div>
    </>
  );
}
