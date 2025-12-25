"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Pencil, Trash2, Plus, Loader2, ShieldCheck,
  FileText, Users, Settings, LayoutDashboard, Database,
  CreditCard, Briefcase, ClipboardList, AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { updateRolePermissions, createRole, deleteRole, updateRoleName } from "./actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

const IconMap: Record<string, any> = {
  FileText, Users, Settings, LayoutDashboard, Database, CreditCard, Briefcase, ClipboardList
};

export default function RolesClient({ initialRoles, availableModules }: any) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [permissions, setPermissions] = useState<any[]>([]);

  // Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [roleToAction, setRoleToAction] = useState<any>(null);

  const [currentCompanyId, setCurrentCompanyId] = useState<string>("");

  useEffect(() => {
    const companyId = document.cookie
      .split('; ')
      .find(row => row.startsWith('current_company_id='))
      ?.split('=')[1];
    if (companyId) setCurrentCompanyId(companyId);
  }, []);

  useEffect(() => {
    if (initialRoles.length > 0) {
      setSelectedRoleId(initialRoles[0].id);
    } else {
      setSelectedRoleId("");
    }
  }, [initialRoles]);

  useEffect(() => {
    if (!availableModules || availableModules.length === 0) return;
    const currentRole = initialRoles.find((r: any) => r.id === selectedRoleId);
    const matrix = availableModules.map((mod: any) => {
      const targetId = mod.id.toString();
      const saved = currentRole?.modulesPermissions?.find((p: any) => {
        const pId = (p.moduleId?.$oid || p.moduleId || "").toString();
        return pId === targetId;
      });
      let allowed = Array.isArray(saved?.allowedPermissions) ? saved.allowedPermissions : [];
      return {
        moduleId: targetId,
        module: mod.nombre,
        iconName: mod.icon,
        visualizar: allowed.includes("read"),
        crear: allowed.includes("create"),
        editar: allowed.includes("update"),
        eliminar: allowed.includes("delete"),
        exportar: allowed.includes("export"),
      };
    });
    setPermissions(matrix);
  }, [selectedRoleId, initialRoles, availableModules]);

  // ACCIONES
  const handleCreateRole = () => {
    if (!newRoleName.trim()) return toast.error("El nombre es obligatorio");
    startCreateTransition(async () => {
      const result = await createRole(newRoleName, currentCompanyId);
      if (result.success) {
        toast.success("Rol creado");
        setNewRoleName("");
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleUpdateName = () => {
    if (!editRoleName.trim()) return toast.error("El nombre no puede estar vacío");
    startTransition(async () => {
      const result = await updateRoleName(roleToAction.id, editRoleName, currentCompanyId);
      if (result.success) {
        toast.success("Nombre actualizado");
        setIsEditModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDeleteConfirm = () => {
    startTransition(async () => {
      const result = await deleteRole(roleToAction.id, currentCompanyId);
      if (result.success) {
        toast.success("Rol eliminado");
        setIsDeleteAlertOpen(false);
        window.location.reload();
      }
    });
  };

  const handleSavePermissions = () => {
    startTransition(async () => {
      const result = await updateRolePermissions(selectedRoleId, permissions, currentCompanyId);
      if (result.success) toast.success("Permisos aplicados correctamente");
    });
  };

  return (
    <div className="p-6 bg-gray-50/50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Administración de roles</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/usuarios" className="hover:text-gray-900">Usuarios</Link>
            <span>•</span>
            <span>Roles y Permisos</span>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800 rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Nuevo rol
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl font-bold text-center text-gray-800">Crear nuevo rol</DialogTitle>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Nombre del rol</label>
                <Input
                  placeholder="Ej. Auditor de Ventas"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="h-12 border-gray-200 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <Button
                onClick={handleCreateRole}
                disabled={isCreating}
                className="w-full h-12 bg-black rounded-2xl mt-4 font-bold text-white text-md hover:bg-gray-900"
              >
                {isCreating ? <Loader2 className="animate-spin" /> : "Guardar Rol"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-[350px_1fr] gap-6 items-start">
        {/* LISTA DE ROLES */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[400px]">
          <h2 className="text-xs font-bold mb-4 text-gray-400 uppercase tracking-widest">Roles de la empresa</h2>
          <div className="space-y-1">
            {initialRoles.map((role: any) => (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all group cursor-pointer ${selectedRoleId === role.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
              >
                <span className="truncate pr-2">{role.name}</span>
                {/* 💡 AHORA SIEMPRE VISIBLES (Sin opacity-0 ni group-hover) */}
                <div className="flex items-center gap-1 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setRoleToAction(role); setEditRoleName(role.name); setIsEditModalOpen(true); }}
                    className="p-1.5 hover:bg-blue-100 rounded-md text-blue-600 transition-colors "
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setRoleToAction(role); setIsDeleteAlertOpen(true); }}
                    className="p-1.5 hover:bg-red-100 rounded-md text-red-500 transition-colors "
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TABLA DE PERMISOS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Matriz de Permisos</h2>
            </div>
            <Button onClick={handleSavePermissions} disabled={isPending || !selectedRoleId} className="bg-gray-900 rounded-xl px-8">
              {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Guardar Cambios
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Módulo</th>
                  {["Ver", "Crear", "Editar", "Borrar", "Exportar"].map((col) => (
                    <th key={col} className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase w-24">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {permissions.map((p) => {
                  const IconComponent = IconMap[p.iconName] || FileText;
                  return (
                    <tr key={p.moduleId} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-semibold text-gray-700">{p.module}</span>
                        </div>
                      </td>
                      {["visualizar", "crear", "editar", "eliminar", "exportar"].map((field) => (
                        <td key={field} className="py-4 text-center">
                          <Checkbox
                            checked={p[field]}
                            onCheckedChange={() => setPermissions(prev => prev.map((item) =>
                              item.moduleId === p.moduleId ? { ...item, [field]: !item[field] } : item
                            ))}
                            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-sm"
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: EDITAR NOMBRE */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">Renombrar rol</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Nuevo nombre</label>
              <Input
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                className="h-12 border-gray-200 focus:ring-blue-500 rounded-xl"
                onFocus={(e) => {
                  const val = e.target.value;
                  e.target.setSelectionRange(val.length, val.length);
                }}
                autoFocus
              />
            </div>
            <Button
              onClick={handleUpdateName}
              disabled={isPending}
              className="w-full h-12 bg-black rounded-2xl mt-4 font-bold text-white text-md hover:bg-gray-900"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Actualizar Nombre"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ALERT: ELIMINAR */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="h-14 w-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
              ¿Eliminar el rol "{roleToAction?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500">
              Esta acción es irreversible. Todos los usuarios que dependen de este rol perderán sus accesos a los módulos configurados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4 px-6 pb-6">
            <AlertDialogCancel className="rounded-xl border-gray-200 h-12 px-8 font-semibold">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 rounded-xl h-12 px-8 font-semibold text-white"
            >
              Sí, eliminar rol
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}