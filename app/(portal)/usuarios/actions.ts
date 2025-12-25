"use server"

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { User, Member, Account, Role } from "@/types";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

/**
 * CREAR USUARIO
 * Crea el perfil, las credenciales y la membresía vinculada a Empresa y Zona.
 */
export async function createUser(data: {
  name: string,
  username: string,
  email: string,
  role: string,
  password: string,
  companyId: string 
}) {
  try {
    await client.connect();
    const db = client.db("testAuth");
    const cId = new ObjectId(data.companyId);

    // 1. BUSCAR LA ZONA DE ECUADOR POR NOMBRE
    // Esto asegura que el zonaId no sea null y el layout permita el acceso
    const ecuadorZone = await db.collection("zonas").findOne({ name: "Ecuador" });

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Crear Usuario (users)
    const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-pink-600", "bg-orange-600"];
    
    const newUser = {
      name: data.name,
      userName: data.username,
      email: data.email,
      isActive: true,
      initials,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
    };

    const userResult = await db.collection("users").insertOne(newUser);
    const newUserId = userResult.insertedId;

    // 4. Crear Cuenta (accounts)
    await db.collection("accounts").insertOne({
      userId: newUserId,
      provider: "Email",
      providerId: data.email,
      password: hashedPassword,
    });

    // 5. Buscar el ID del Rol
    const roleDoc = await db.collection("roles").findOne({ 
      name: data.role,
      companyId: cId 
    });

    // 6. Crear membresía CON ZONAID DE ECUADOR
    const newMember = {
      userId: newUserId,
      companyId: cId,
      zonaId: ecuadorZone?._id || null, // Se asigna el ID de la zona encontrada
      roleId: roleDoc?._id || null,
      status: "accepted",
      createdAt: new Date(),
    };

    await db.collection("members").insertOne(newMember);

    revalidatePath("/usuarios");
    return { success: true };
    
  } catch (e) {
    console.error("❌ Error al crear usuario:", e);
    return { success: false, error: "No se pudo crear el usuario" };
  } finally {
    await client.close();
  }
}

/**
 * ACTUALIZAR USUARIO
 * Actualiza el perfil y sincroniza el Rol/Zona en la membresía de la empresa actual.
 */
export async function updateUser(userId: string, data: { name: string, role: string, companyId: string }) {
  try {
    await client.connect();
    const db = client.db("testAuth");
    const uId = new ObjectId(userId);
    const cId = new ObjectId(data.companyId);

    // 1. Obtener datos de la empresa (para asegurar zonaId)
    const companyDoc = await db.collection("companies").findOne({ _id: cId });

    // 2. Actualizar datos básicos
    await db.collection<User>("users").updateOne(
      { _id: uId },
      { $set: { name: data.name, updatedAt: new Date() } }
    );

    // 3. Actualizar membresía de la empresa actual
    const roleDoc = await db.collection<Role>("roles").findOne({ 
      name: data.role, 
      companyId: cId 
    });

    if (roleDoc && companyDoc) {
      await db.collection<Member>("members").updateOne(
        { userId: uId, companyId: cId },
        { 
          $set: { 
            roleId: roleDoc._id,
            zonaId: companyDoc.zonaId, // Aseguramos que la zona sea correcta
            updatedAt: new Date()
          } 
        }
      );
    }

    revalidatePath("/usuarios");
    return { success: true };
  } catch (e) {
    console.error("❌ Error al actualizar:", e);
    return { success: false, error: "Error al actualizar" };
  } finally {
    await client.close();
  }
}

/**
 * ELIMINAR USUARIO
 * Borrado total del sistema (Cascada)
 */
export async function deleteUser(userId: string) {
  try {
    await client.connect();
    const db = client.db("testAuth");
    const uId = new ObjectId(userId);

    // Ejecutamos eliminaciones en todas las colecciones donde el usuario tiene presencia
    await Promise.all([
      db.collection("users").deleteOne({ _id: uId }),
      db.collection("members").deleteMany({ userId: uId }),
      db.collection("accounts").deleteMany({ userId: uId })
    ]);

    revalidatePath("/usuarios");
    return { success: true };
  } catch (e) {
    console.error("❌ Error al eliminar:", e);
    return { success: false, error: "No se pudo eliminar el usuario" };
  } finally {
    await client.close();
  }
}