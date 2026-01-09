"use server"

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

/**
 * CREA UN NUEVO ROL VINCULADO A UNA EMPRESA
 */
export async function createRole(name: string, companyId: string) {
  try {
    await client.connect();
    const db = client.db("testAuth");

    const result = await db.collection("roles").insertOne({
      name: name,
      description: "", 
      companyId: new ObjectId(companyId),
      modulesPermissions: [], 
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/usuarios/roles");
    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error al crear rol:", error);
    return { success: false, error: "No se pudo crear el rol" };
  } finally {
    await client.close();
  }
}

/**
 * ACTUALIZA EL NOMBRE DE UN ROL
 */
export async function updateRoleName(roleId: string, newName: string, companyId: string) {
  try {
    await client.connect();
    const db = client.db("testAuth");

    const result = await db.collection("roles").updateOne(
      { 
        _id: new ObjectId(roleId), 
        companyId: new ObjectId(companyId) 
      },
      { 
        $set: { 
          name: newName, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "No se encontró el rol o no tienes permiso" };
    }

    revalidatePath("/usuarios/roles");
    return { success: true };
  } catch (error) {
    console.error("Error al renombrar rol:", error);
    return { success: false, error: "Error al actualizar el nombre" };
  } finally {
    await client.close();
  }
}


export async function updateRolePermissions(
  roleId: string,
  permissionsMatrix: { moduleId: string; visualizar?: boolean; crear?: boolean; editar?: boolean; eliminar?: boolean; exportar?: boolean }[],
  companyId: string
) {
  try {
    await client.connect();
    const db = client.db("testAuth");

    // Convertir a array de permisos minimalista
    const modulesPermissions = permissionsMatrix.map((row) => {
      const allowed: string[] = [];
      if (row.visualizar) allowed.push("read");
      if (row.crear) allowed.push("create");
      if (row.editar) allowed.push("update");
      if (row.eliminar) allowed.push("delete");
      if (row.exportar) allowed.push("export");

      return {
        moduleId: new ObjectId(row.moduleId),
        allowedPermissions: allowed
      };
    });

    // Actualizar rol
    const result = await db.collection("roles").updateOne(
      { _id: new ObjectId(roleId), companyId: new ObjectId(companyId) },
      { $set: { modulesPermissions, updatedAt: new Date() } }
    );

    revalidatePath("/usuarios/roles");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar permisos:", error);
    return { success: false, error: "Error al actualizar permisos" };
  } finally {
    await client.close();
  }
}

/**
 * ELIMINA UN ROL (VALIDANDO EMPRESA)
 */
export async function deleteRole(roleId: string, companyId: string) {
  try {
    await client.connect();
    const db = client.db("testAuth");

    const result = await db.collection("roles").deleteOne({
      _id: new ObjectId(roleId),
      companyId: new ObjectId(companyId)
    });

    if (result.deletedCount === 0) {
      return { success: false, error: "No se encontró el rol o no tienes permiso para borrarlo" };
    }

    revalidatePath("/usuarios/roles");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    return { success: false, error: "No se pudo eliminar el rol" };
  } finally {
    await client.close();
  }
}