"use server"

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

// Helper para obtener la DB
async function getDb() {
  await client.connect();
  return client.db("testAuth");
}

/**
 * 🔍 BUSCAR USUARIO POR EMAIL
 * Se usa para verificar si el usuario ya existe en el sistema global
 */
export async function getUserByEmail(email: string) {
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });
    return { 
      exists: !!user, 
      name: user?.name || null 
    };
  } catch (error) {
    return { exists: false, name: null };
  }
}

/**
 * 🚀 CREAR O VINCULAR USUARIO
 */
export async function createUser(data: {
  email: string,
  role: string,
  companyId: string
}) {
  try {
    const db = await getDb();
    const cId = new ObjectId(data.companyId);

    // 1. Gestionar Identidad Global (Colección 'users')
    let user = await db.collection("users").findOne({ email: data.email });
    let userId: ObjectId;

    if (!user) {
      const userNamePrefix = data.email.split('@')[0];
      
      const userRes = await db.collection("users").insertOne({
        name: userNamePrefix,
        email: data.email,
        userName: userNamePrefix,
        isActive: true,
        avatarColor: "bg-indigo-600",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      userId = userRes.insertedId;
    } else {
      userId = user._id;
      const alreadyMember = await db.collection("members").findOne({ 
        userId, 
        companyId: cId 
      });
      
      if (alreadyMember) {
        return { success: false, error: "Este usuario ya esta registrado" };

      }
    }

    // 2. Obtener IDs de Rol y Zona
    // Buscamos el rol
    const roleDoc = await db.collection("roles").findOne({ name: data.role, companyId: cId });

    // BUSCAR LA ZONA POR PATH (Ecuador /ec)
    const zonaDoc = await db.collection("zonas").findOne({ path: "/ec" });

    // 3. Crear Membresía (Acceso específico)
    await db.collection("members").insertOne({
      userId,
      companyId: cId,
      status: "accepted",
      roleId: roleDoc?._id || null,
      zonaId: zonaDoc?._id || null, // Ahora usa el ID de la zona encontrada por path
      createdAt: new Date()
    });

    revalidatePath("/usuarios");
    return { success: true, message: "Usuario vinculado correctamente" };
  } catch (e) {
    console.error("Error en createUser:", e);
    return { success: false, error: "Error en el servidor al procesar el registro" };
  }
}

/**
 * 📝 ACTUALIZAR PERMISOS (UPDATE)
 * Solo modifica la relación en 'members', no toca la identidad global.
 */
export async function updateUser(userId: string, data: { role: string, companyId: string }) {
  try {
    const db = await getDb();
    const cId = new ObjectId(data.companyId);
    const uId = new ObjectId(userId);

    // Buscamos el ID del nuevo rol en esta empresa
    const roleDoc = await db.collection("roles").findOne({ 
      name: data.role, 
      companyId: cId 
    });

    if (!roleDoc) return { success: false, error: "El rol seleccionado no es válido" };

    // Actualizamos el rol dentro de la membresía de ESTA empresa
    const result = await db.collection("members").updateOne(
      { userId: uId, companyId: cId },
      { $set: { roleId: roleDoc._id, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return { success: false, error: "No se encontró el vínculo de membresía" };

    revalidatePath("/usuarios");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Error al actualizar los permisos" };
  }
}

/**
 * 🗑️ RETIRAR ACCESO (DELETE)
 * Elimina el registro de 'members'. El usuario sigue existiendo en 'users'.
 */
export async function deleteUser(userId: string, companyId: string) {
  try {
    const db = await getDb();
    
    // Solo eliminamos la relación con la empresa actual
    await db.collection("members").deleteOne({ 
      userId: new ObjectId(userId), 
      companyId: new ObjectId(companyId) 
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (e) {
    console.error("Error en deleteUser:", e);
    return { success: false, error: "No se pudo retirar el acceso del colaborador" };
  }
}