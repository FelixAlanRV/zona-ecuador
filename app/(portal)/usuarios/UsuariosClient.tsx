"use client"

import { useState, useTransition, useEffect } from "react"
import { Search, Pencil, Trash2, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { createUser, updateUser, deleteUser } from "./actions"
import { toast } from "sonner"

interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  role: string;
  password: string;
  companyId: string;
}

export default function UsuariosClient({ initialUsers, roles }: { initialUsers: any[], roles: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCompanyId, setCurrentCompanyId] = useState<string>("");

  useEffect(() => {
    const companyId = document.cookie
      .split('; ')
      .find(row => row.startsWith('current_company_id='))
      ?.split('=')[1];
    if (companyId) setCurrentCompanyId(companyId);
  }, []);

  const [createData, setCreateData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    password: ""
  });

  const [editData, setEditData] = useState({ name: "", role: "" });

  const handleCreate = () => {
    if (!currentCompanyId) return toast.error("Seleccione una empresa primero");
    startTransition(async () => {
      const res = await createUser({ ...createData, companyId: currentCompanyId });
      if (res.success) {
        toast.success("Usuario registrado con éxito");
        setOpenCreate(false);
        setCreateData({ name: "", username: "", email: "", role: "", password: "" });
      } else {
        toast.error(res.error || "Error al crear");
      }
    });
  };

  const handleUpdate = () => {
    if (!currentCompanyId) return toast.error("No se detectó la empresa actual");
    startTransition(async () => {
      if (!selectedUser) return;
      const res = await updateUser(selectedUser.id, { ...editData, companyId: currentCompanyId });
      if (res.success) {
        toast.success("Usuario actualizado correctamente");
        setOpenEdit(false);
      } else {
        toast.error(res.error || "Error al actualizar");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      if (!selectedUser) return;
      const res = await deleteUser(selectedUser.id);
      if (res.success) {
        toast.success("Acceso eliminado");
        setOpenDelete(false);
      }
    });
  };

  const prepareEdit = (u: any) => {
    setSelectedUser(u);
    setEditData({ name: u.name, role: u.roleName });
    setOpenEdit(true);
  };

  return (
    <div className="p-8 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Administración de usuarios</h1>
          <p className="text-sm text-gray-400 mt-1">Gestión de personal para la empresa seleccionada</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setOpenCreate(true)} className="bg-gray-900 hover:bg-black rounded-xl px-6 font-semibold text-white">Nuevo usuario</Button>
          <Button asChild variant="outline" className="rounded-xl border-gray-200"><Link href="/usuarios/roles">Roles</Link></Button>
        </div>
      </div>

      <div className="relative w-80 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Buscar por nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-gray-100 bg-gray-50/50 rounded-xl focus:ring-blue-500" />
      </div>

      {/* TABLA */}
      <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estatus</th>
              <th className="px-6 py-4 w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-5 flex items-center gap-4">
                  <Avatar className={`h-10 w-10 ${user.avatarColor} text-white`}>
                    <AvatarFallback className={`${user.avatarColor} text-white font-bold`}>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-900 font-medium">{user.username}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{user.roleName}</td>
                <td className="px-6 py-5">
                  {user.isActive ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold italic">
                      <CheckCircle2 className="h-4 w-4 fill-blue-600/10" /> Activo
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-semibold italic">
                      <AlertTriangle className="h-4 w-4" /> Inactivo
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prepareEdit(user)}
                    className="p-1.5 hover:bg-blue-100 rounded-md text-blue-600 transition-colors "
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setOpenDelete(true); }}
                    className="p-1.5 hover:bg-red-100 rounded-md text-red-500 transition-colors "
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL REGISTRO */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-gray-50">
            <DialogTitle className="text-center text-xl font-bold">Registro de usuario</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
              <Input value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value })} className="h-12 rounded-xl border-gray-200" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Usuario</label>
              <Input value={createData.username} onChange={(e) => setCreateData({ ...createData, username: e.target.value })} className="h-12 rounded-xl border-gray-200" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <Input value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} className="h-12 rounded-xl border-gray-200" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} className="h-12 rounded-xl border-gray-200" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rol</label>
              <Select onValueChange={(v) => setCreateData({ ...createData, role: v })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200"><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} disabled={isPending} className="w-full h-14 bg-gray-900 rounded-2xl mt-4 font-bold text-white text-lg hover:bg-black">
              {isPending ? <Loader2 className="animate-spin" /> : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL ACTUALIZAR */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 border-b border-gray-50">
            <DialogTitle className="text-center text-xl font-bold">Actualizar usuario</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="h-12 rounded-xl border-gray-200 focus:ring-blue-500"
                autoFocus
                onFocus={(e) => {
                  const val = e.target.value;
                  e.target.setSelectionRange(val.length, val.length);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rol</label>
              <Select value={editData.role} onValueChange={(v) => setEditData({ ...editData, role: v })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} disabled={isPending} className="w-full h-14 bg-gray-900 rounded-2xl font-bold text-white text-lg hover:bg-black">
              {isPending ? <Loader2 className="animate-spin" /> : "Actualizar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL ELIMINAR */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 h-20 w-20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-gray-900">¿Eliminar acceso?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-500">
              Se quitará el permiso de <span className="font-bold text-gray-800">{selectedUser?.name}</span> para esta empresa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4 mt-8 px-6">
            <AlertDialogCancel className="rounded-2xl h-12 px-8 font-semibold border-gray-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-2xl h-12 px-8 font-bold text-white transition-all shadow-md">
              {isPending ? <Loader2 className="animate-spin" /> : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}