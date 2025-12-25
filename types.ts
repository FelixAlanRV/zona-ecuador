import { ObjectId } from "mongodb";

// 1. Modelo de la colección 'accounts'
export interface Account {
  _id: ObjectId | string;
  userId: ObjectId | string;
  provider: string;
  providerId: string;
  password: string;
}

// 2. Modelo de la colección 'users'
export interface User {
  _id: ObjectId | string;
  name: string;
  userName: string;
  email: string;
  isActive: boolean;
  initials: string;
  avatarColor: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 3. Modelo de la colección 'roles' (NUEVO)
export interface Role {
  _id: ObjectId | string;
  name: string;
  description?: string;
  // Lista de países a los que este rol tiene acceso global
  allowedCountries: string[];
  // Configuración granular por módulo
  modulesPermissions: {
    moduleId: ObjectId | string;
    moduleName: string;
    pais: string;
    allowedPermissions: string[]; // ["read", "create", "update", etc.]
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// 4. Modelo de la colección 'members'
export interface Member {
  _id: ObjectId | string;
  userId: ObjectId | string;
  companyId: ObjectId | string;
  status: "accepted" | "pending" | "declined";
  roleId: ObjectId | string;
  zonaId: ObjectId | string;
  createdAt: Date;
}

// 5. Interfaz para la UI (Frontend)
export interface UserDisplay {
  id: string;
  name: string;
  username: string;
  email: string;
  roleName: string;
  // NUEVO: Para saber qué países puede ver este usuario en la tabla
  initials: string;
  avatarColor: string;
}

