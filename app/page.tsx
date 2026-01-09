import { MongoClient, ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from "next/navigation";

export default async function EcuadorPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) redirect('/login');

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string; // El ID que sí viene en el token

    await client.connect();
    const db = client.db("testAuth");

    // 1. Buscamos la membresía de este usuario para la zona Ecuador
    // Primero necesitamos el ID de la zona "Ecuador"
    const zona = await db.collection("zonas").findOne({ path: "/ec" });
    
    if (!zona) {
      console.error("Zona /ec no encontrada");
      redirect('/login?error=zona_not_found');
    }

    const membership = await db.collection("members").findOne({ 
      userId: new ObjectId(userId),
      zonaId: zona._id,
      status: "accepted"
    });

    if (!membership) {
      console.error("Usuario sin membresía aceptada en Ecuador");
      redirect('/login?error=no_membership');
    }

    // 2. Buscamos el ROL y su primer módulo
    const roleDoc = await db.collection("roles").findOne({ _id: membership.roleId });
    
    if (!roleDoc) {
      console.error("Rol no encontrado en DB");
      redirect('/login?error=role_not_found');
    }

    const firstModuleId = roleDoc.modulesPermissions?.[0]?.moduleId;
    let destination = "/ec/dashboardfff";

    if (firstModuleId) {
      const moduleData = await db.collection("modules").findOne({ _id: new ObjectId(firstModuleId) });
      if (moduleData?.url) {
        destination = moduleData.url;
      }
    }

    
    await client.close();
    console.log("🚀 Redirigiendo a módulo inicial:", destination);
    redirect(destination);

  } catch (e: any) {
    if (e.digest?.includes('NEXT_REDIRECT')) throw e;
    
    console.error("🔥 Error en EcuadorPage:", e.message);
    redirect('/login?error=server_error');
  } finally {
    await client.close();
  }

  return null;
}