"use client"

import { useState } from 'react';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { logoutAction } from '@/app/actions/route';

// ----------------------------------------------------------------------
const OPTIONS = [
  // {
  //   label: 'Perfil',
  //   linkTo: `/dashboard/perfil?perfil`,
  //   icon: 'fa-user',
  // },
  {
    label: 'Contraseña',
    linkTo: `/dashboard/perfil?contraseña`,
    icon: 'Lock',
  },
];

// ----------------------------------------------------------------------

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function AccountPopover() {
  const [open, setOpen] = useState(false);

  const user = {
    name: 'John Doe',
    displayName: 'John Doe',
    userName: 'johndoe',
    photoURL: `${basePath}/ec/static/mock-images/avatars/avatar_default.jpg`,
  };

  const handleLogout = async () => {
    toast.info("Cerrando sesión...");
    await logoutAction(); // Esto borra la cookie y te saca de aquí
  };

  const handleClickItem = (path: string) => {
    setOpen(false);
    // router.push(path);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 cursor-pointer">
          <Avatar className="h-9 w-9 border-2 border-background">
            <AvatarImage src={user?.photoURL} alt={user?.displayName} />
            <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.userName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map((option) => (
          <DropdownMenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
            {(() => {
              const Icon = (Icons as any)[option.icon];
              return Icon ? <Icon className="mr-2 h-4 w-4" /> : null;
            })()}
            {option.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
