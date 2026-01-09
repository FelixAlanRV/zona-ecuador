import { MongoClient, ObjectId } from 'mongodb';
import { cookies, headers } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from "next/navigation";
import { SettingsProvider } from '@/utils/context/settings-provider';
import DashboardLayoutContent from './DashboardLayoutContent';
import { Module } from '@/types';

async function getEcuadorContext(userId: string) {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);
  const COUNTRY_NAME = "Ecuador";

  try {
    await client.connect();
    const db = client.db("testAuth");

    const allMemberships = await db.collection("members")
      .find({ userId: new ObjectId(userId), status: "accepted" })
      .toArray();

    if (allMemberships.length === 0) return { navDataByCompany: {}, allowedCompanies: [], availableCountries: [] };

    const zonaIds = allMemberships.map(m => m.zonaId);
    const zonas = await db.collection("zonas").find({ _id: { $in: zonaIds } }).toArray();
    const availableCountries = zonas.map(z => z.name || z.nombre);

    const ecuadorZone = zonas.find(z => (z.name || z.nombre).toLowerCase().includes(COUNTRY_NAME.toLowerCase()));
    const ecuadorMemberships = allMemberships.filter(m => m.zonaId.toString() === ecuadorZone?._id.toString());

    const profiles = await Promise.all(ecuadorMemberships.map(async (member) => {
      const [company, role] = await Promise.all([
        db.collection("companies").findOne({ _id: member.companyId }),
        db.collection("roles").findOne({ _id: member.roleId })
      ]);

      const rolePerms = role?.modulesPermissions || [];
      const modIds = rolePerms.map((p: any) => new ObjectId(p.moduleId));
      const detailedModules = await db.collection("modules").find({ _id: { $in: modIds } }).toArray();

      return {
        companyId: member.companyId.toString(),
        companyInfo: {
          id: member.companyId.toString(),
          name: company?.name || company?.nombre || "Sin nombre",
          zona: COUNTRY_NAME,
          logo: company?.logo || ""
        },
        modules: detailedModules
          .map(m => {
            const perm = rolePerms.find((rp: any) => rp.moduleId.toString() === m._id.toString());
            const allowed = perm?.allowedPermissions ? Object.values(perm.allowedPermissions) : [];

            let modUrl = m.url || "";
            if (modUrl && !modUrl.startsWith('/')) modUrl = `/${modUrl}`;

            return {
              nombre: m.name || m.nombre,
              url: modUrl,
              icono: m.icon || 'File',
              position: m.position ?? 999,
              acciones: {
                visualizar: allowed.includes("read"),
                crear: allowed.includes("create"),
                editar: allowed.includes("update"),
                eliminar: allowed.includes("delete"),
              }
            };
          })
          .sort((a, b) => a.position - b.position)
      };
    }));

    const navDataByCompany = profiles.reduce((acc: any, curr) => {
      acc[curr.companyId] = curr.modules;
      return acc;
    }, {});

    return {
      navDataByCompany,
      allowedCompanies: profiles.map(p => p.companyInfo),
      availableCountries
    };
  } finally {
    await client.close();
  }
}

export default async function DashboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{ pais: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) redirect('/login');

  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

  const user = {
    id: payload.id as string,
    name: payload.name as string,
    email: payload.email as string,
  };

  const context = await getEcuadorContext(payload.id as string);

  console.log("===== CONTEXTO OBTENIDO =====");
  console.log(JSON.stringify(context, null, 2));

  // 🔑 Obtenemos la empresa activa desde la cookie
  const currentCompanyId = cookieStore.get('current_company_id')?.value || context.allowedCompanies[0]?.id;

  const headerList = await headers();
  const currentPath = headerList.get('x-current-path') || "";

  // Normalización de ruta para validación
  const parts = currentPath.split('/').filter(Boolean);
  const detectedPais = parts.length > 0 && parts[0].length === 2 ? parts[0] : "ec";

  if (parts.length > 0 && parts[0] === detectedPais) parts.shift();

  const normalizedCurrent = parts.length === 0 ? "/" : `/${parts.join('/')}`;

  // 🔐 Validación de rutas SOLO para la empresa activa
const allowedUrlsForCompany = ((context.navDataByCompany[currentCompanyId] || []) as Module[])
  .filter(m => m.acciones?.visualizar)
  .map(m => m.url)
  .filter(Boolean);


  const isDashboardBase = normalizedCurrent === "/" || normalizedCurrent === "/dashboard";

  const isAllowed = isDashboardBase || allowedUrlsForCompany.some(url => {
    const cleanUrl = url.endsWith('/') && url !== '/' ? url.slice(0, -1) : url;
    return normalizedCurrent === cleanUrl || normalizedCurrent.startsWith(`${cleanUrl}/`);
  });

  if (!isAllowed) {
    console.log("Ruta denegada:", normalizedCurrent);
    // Evitar duplicar el prefijo del país cuando la ruta ya lo contiene
    const hasCountryPrefix = currentPath.startsWith(`/${detectedPais}`);
    redirect(hasCountryPrefix ? '/unauthorized' : `/${detectedPais}/unauthorized`);
  } else {
    console.log("Ruta permitida:", normalizedCurrent);
  }

  return (
    <SettingsProvider
      defaultSettings={{
        themeMode: 'light',
        themeDirection: 'ltr',
        themeContrast: 'default',
        themeLayout: 'vertical',
        themeColorPresets: 'default',
        themeStretch: false,
      }}
    >
      <DashboardLayoutContent
        user={user}
        navDataByCompany={context.navDataByCompany}
        allowedCompanies={context.allowedCompanies}
        availableCountries={context.availableCountries}
      >
        {children}
      </DashboardLayoutContent>
    </SettingsProvider>
  );
}
