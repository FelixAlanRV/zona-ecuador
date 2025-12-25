'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// --- INTERFACES ---
interface Company {
  id: string;
  name: string;
  zona: string;
  logo?: string;
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: string; // <-- Recibimos el estado actual
  onSelectCompany: (company: Company) => void;
}

export default function CompanySelector({
  companies = [],
  selectedCompanyId,
  onSelectCompany,
}: CompanySelectorProps) {
  const [open, setOpen] = useState(false);

  // 1. Ahora la empresa activa es simplemente la que coincide con el ID seleccionado
  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const handleSelect = (company: Company) => {
    setOpen(false);
    onSelectCompany?.(company); // Avisamos al NavVertical del cambio
  };

  return (
    <div className="px-3 pb-5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto py-2 px-2 hover:bg-accent/50 transition-all duration-200",
              "border border-transparent hover:border-border",
              open && "bg-accent border-border"
            )}
          >
            <div className="flex items-center gap-3 min-w-0 text-left">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col items-start min-w-0 leading-tight">
                <span className="text-sm font-semibold truncate w-full text-foreground">
                  {activeCompany?.name || 'Seleccionar...'}
                </span>
                <span className="text-[11px] text-muted-foreground font-normal uppercase tracking-wider">
                  {activeCompany?.zona || 'Organización'}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-40" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[260px] p-0" align="start" side="right" sideOffset={8}>
          <Command>
            <CommandInput placeholder="Buscar empresa..." />
            <CommandEmpty>No se encontraron empresas.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto p-1">
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={() => handleSelect(company)}
                  className="cursor-pointer mb-1 rounded-md"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-7 h-7 rounded bg-muted flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-medium">{company.name}</span>
                      <span className="text-[10px] text-muted-foreground">{company.zona}</span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4 flex-shrink-0 text-primary',
                      selectedCompanyId === company.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}