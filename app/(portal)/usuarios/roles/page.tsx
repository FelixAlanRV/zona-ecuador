import { MongoClient, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import RolesClient from "./RolesClient";

export const dynamic = 'force-dynamic';


async function getRolesData(companyId: string | undefined) {
  if (!companyId) return { roles: [], availableModules: [] };

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db("testAuth");

    // 1️⃣ Traer roles de la empresa
    const roles = await db.collection("roles")
      .find({ companyId: new ObjectId(companyId) })
      .toArray();

    // 2️⃣ Obtener todos los IDs de módulos que están en los roles
    const moduleIdsInRoles = roles.flatMap(r =>
      (r.modulesPermissions || []).map((p: any) => new ObjectId(p.moduleId))
    );

    // 3️⃣ Traer solo los módulos que pertenecen a estos roles
    const modules = await db.collection("modules")
      .find({ _id: { $in: moduleIdsInRoles } })
      .sort({ posicion: 1 })
      .toArray();

    const availableModules = modules.map(m => ({
      id: m._id.toString(),
      nombre: m.name,
      icon: m.icon || "FileText",
    }));

    // 4️⃣ Formatear roles para el frontend
    const formattedRoles = roles.map(r => ({
      id: r._id.toString(),
      name: r.name,
      modulesPermissions: Array.isArray(r.modulesPermissions) ? r.modulesPermissions : [],
    }));

    return {
      roles: formattedRoles,
      availableModules
    };
  } catch (e) {
    console.error("Error en Roles Data:", e);
    return { roles: [], availableModules: [] };
  } finally {
    await client.close();
  }
}


export default async function RolesPage() {
  const cookieStore = await cookies();
  const currentCompanyId = cookieStore.get("current_company_id")?.value;

  const data = await getRolesData(currentCompanyId);

  // 🔍 Imprimir lo que se obtuvo de la DB
  console.log("📊 [DEBUG] Roles obtenidos:", JSON.stringify(data.roles, null, 2));
  console.log("📊 [DEBUG] Módulos disponibles:", JSON.stringify(data.availableModules, null, 2));

  return (
    <RolesClient
      initialRoles={JSON.parse(JSON.stringify(data.roles))}
      availableModules={JSON.parse(JSON.stringify(data.availableModules))}
    />
  );
}
