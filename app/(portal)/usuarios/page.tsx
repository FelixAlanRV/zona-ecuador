import { MongoClient, ObjectId } from "mongodb";
import { cookies } from 'next/headers';
import UsuariosClient from "./UsuariosClient";
import { UserDisplay } from "@/types";

async function getData(companyId: string | undefined) {
  if (!companyId) {
    console.log("⚠️ No se recibió companyId");
    return { users: [], roles: [] };
  }

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db("testAuth");

    // 1️⃣ Usuarios filtrados por empresa
    const usersWithDetails = await db.collection("users").aggregate([
      {
        $lookup: {
          from: "members",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$companyId", new ObjectId(companyId)] }
                  ]
                }
              }
            }
          ],
          as: "membership"
        }
      },
      { $unwind: "$membership" },
      {
        $lookup: {
          from: "roles",
          localField: "membership.roleId",
          foreignField: "_id",
          as: "roleDetails"
        }
      },
      { $unwind: { path: "$roleDetails", preserveNullAndEmptyArrays: true } }
    ]).toArray();

    // 2️⃣ Roles filtrados por la empresa activa
    const rolesFromDb = await db.collection("roles")
      .find({ companyId: new ObjectId(companyId) }) // <-- filtrado por empresa
      .toArray();

    // 3️⃣ Mapeo de usuarios para enviar al cliente
    const mappedUsers: UserDisplay[] = usersWithDetails.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Sin nombre",
      username: u.userName || "n/a",
      email: u.email,
      roleName: u.roleDetails?.name || "Sin Rol",
      isActive: u.isActive ?? false,
      avatarColor: u.avatarColor || "bg-blue-600",
    }));

    return {
      users: JSON.parse(JSON.stringify(mappedUsers)),
      roles: JSON.parse(JSON.stringify(
        rolesFromDb.map(r => ({
          id: r._id.toString(),
          name: r.name,
        }))
      ))
    };
  } finally {
    await client.close();
  }
}

export default async function UsuariosPage() {
  const cookieStore = await cookies();
  const currentCompanyId = cookieStore.get('current_company_id')?.value;

  console.log("🍪 Empresa recibida desde cookie:", currentCompanyId);

  const { users, roles } = await getData(currentCompanyId);

  console.log("📦 Usuarios enviados al cliente:", users);
  console.log("📦 Roles enviados al cliente:", roles);

  return <UsuariosClient initialUsers={users} roles={roles} />;
}
